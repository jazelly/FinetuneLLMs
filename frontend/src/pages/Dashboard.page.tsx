import React, { useEffect, useRef, useState } from "react";
import FinetunePanel from "@/components/FinetunePanel.component";
import DivResizeHandle from "@/components/DivResizeHandle.component";
import { ResizableBox } from "react-resizable";
import type { ResizeHandle } from "react-resizable";
import "react-resizable/css/styles.css";
import DashboardModel from "../models/dashboard";
import { AllJobOptions } from "@/models/types/dashboard";
import { useParams } from "react-router-dom";
import DetailPanel from "@/components/DetailPanel.component";
import MetaPanel from "@/components/MetaPanel.component";

const Dashboard = ({ trainerSocket }) => {
  const { jobId } = useParams();

  const sendMessageToTrainer = (msg: string) => {
    if (trainerSocket && msg) {
      trainerSocket.send(msg);
    }
  };

  const [jobOptions, setJobOptions] = useState<AllJobOptions | undefined>(
    undefined
  );

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
        const resp = await DashboardModel.getJobOptions();
        if (!resp.success) {
          setJobOptions({
            baseModels: [],
            trainingMethods: [],
            datasets: [],
            hyperparameters: {},
          });
        } else {
          setJobOptions(resp.data);
        }
      } catch (error: any) {
        setError(error);
      }
    };

    fetchJobOptions();
  }, []);

  const initialLeftWidth = ((window.innerWidth - 42 - 16) * 3) / 5;
  const initialTopHeight = ((window.innerHeight - 32 - 64) * 2) / 3; // 32 is the bottom gap, 64 is the top gap

  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [topHeight, setTopHeight] = useState(initialTopHeight);

  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);

  const [isHoldingHandle, setIsHoldingHandle] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftResize = (event, { size }) => {
    setLeftWidth(size.width);
  };

  const handleTopResize = (event, { size }) => {
    setTopHeight(size.height);
  };

  // TODO: lift it to global so it can catch all mouse up
  const handleMouseUp = (e, cb) => {
    setIsHoldingHandle(false);
    if (cb) cb(e);
  };

  const containerHeight = window.innerHeight - 32 - 64;
  const minHeightTop = 64 + 350; // 64 is the top header gap, 350 is the minimum height for panel
  const minHeightBottom = 100;
  const maxHeightTop = containerHeight - minHeightBottom;
  const minWidthLeft = 42 + 200;
  const maxWidthLeft = window.innerWidth - 32 - 330; // 32 is the right empty gap, 330 is the min width of detail panel

  const toggleRightCollapse = () => {
    if (isRightCollapsed) {
      setLeftWidth(initialLeftWidth); // TODO: use snapshot of last time left width
    } else {
      setLeftWidth(containerRef.current!.offsetWidth - 8 - 12.5);
    }
    setIsRightCollapsed(!isRightCollapsed);
  };

  const toggleBottomCollapse = () => {
    if (isBottomCollapsed) {
      setTopHeight(initialTopHeight);
    } else {
      setTopHeight(containerRef.current!.offsetHeight);
    }
    setIsBottomCollapsed(!isBottomCollapsed);
  };

  const handleHyperparametersChange = (
    hyperparameters: AllJobOptions["hyperparameters"]
  ) => {
    setJobOptions({
      ...jobOptions!,
      hyperparameters,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={(e) => handleMouseUp(e, undefined)}
      className="flex h-full"
    >
      <ResizableBox
        width={leftWidth}
        height={containerRef.current?.offsetHeight ?? containerHeight}
        axis="x"
        resizeHandles={isRightCollapsed ? [] : ["e"]}
        handle={(handleAxis: ResizeHandle, ref) => (
          <DivResizeHandle
            className={`handle-${handleAxis} div-handle div-handle-drag-horizontal`}
            isHoldingHandle={isHoldingHandle}
            setIsHoldingHandle={setIsHoldingHandle}
            handleMouseUp={(e, cb) => handleMouseUp(e, cb)}
            innerRef={ref}
          />
        )}
        onResize={handleLeftResize}
        minConstraints={[minWidthLeft, Infinity]} // width and height
        maxConstraints={[maxWidthLeft, Infinity]}
        className="flex"
      >
        <div className="flex flex-col p-10 h-full">
          <ResizableBox
            width={leftWidth}
            height={topHeight}
            axis="y"
            resizeHandles={isBottomCollapsed ? [] : ["s"]}
            onResize={handleTopResize}
            minConstraints={[leftWidth, minHeightTop]} // width and height
            maxConstraints={[leftWidth, maxHeightTop]}
          >
            <FinetunePanel
              jobOptions={jobOptions}
              sendMessageToTrainer={sendMessageToTrainer}
            />
          </ResizableBox>
          <div className="flex-1 bg-white"> Bottom </div>
        </div>
      </ResizableBox>
      {!isRightCollapsed && (
        <div className="flex-1 bg-white">
          {jobId !== undefined ? (
            <DetailPanel jobId={jobId} />
          ) : (
            <MetaPanel
              hyperparameters={jobOptions?.hyperparameters ?? {}}
              handleHyperparametersChange={handleHyperparametersChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

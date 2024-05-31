import React, { useState } from "react";
import ReactGridLayout, { WidthProvider } from "react-grid-layout";

const Dashboard = () => {
  const [dragging, setDragging] = useState(false);
  const [layout, setLayout] = useState([
    { x: 0, y: 0, w: 2, h: 1 },
    { x: 2, y: 0, w: 2, h: 1 },
    { x: 1, y: 0, w: 1, h: 1 },
  ]);

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragStop = () => {
    setDragging(false);
  };

  const onResize = (layout) => {
    setLayout(layout);
  };

  return (
    <WidthProvider>
      <div
        className="flex h-screen"
        style={{
          overflow: "hidden",
        }}
      >
        <div
          className="bg-red-500 flex-1"
          style={{
            overflow: "hidden",
          }}
        >
          <div
            className="text-lg p-4"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            Flexbox 1
          </div>
        </div>
        <div
          className="bg-blue-500"
          style={{
            position: "relative",
            flex: "0 0 auto",
            width: "20px",
            cursor: "ew-resize",
          }}
        >
          {dragging && (
            <div
              className="absolute top-0 left-0 bg-black w-full h-full opacity-50"
              style={{
                zIndex: -1,
              }}
            />
          )}
        </div>
        <div
          className="bg-green-500 flex-1"
          style={{
            overflow: "hidden",
          }}
        >
          <div
            className="text-lg p-4"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            Flexbox 2
          </div>
        </div>
        <ReactGridLayout
          className="absolute top-0 left-0"
          layout={layout}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResize={onResize}
          cols={3}
          rowHeight={30}
          width={1200}
        >
          <div key="a" className="bg-red-500">
            <div
              className="text-lg p-4"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              Flexbox 1
            </div>
          </div>
          <div key="c" className="bg-blue-500">
            <div
              className="text-lg p-4"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              Draggable Div
            </div>
          </div>
          <div key="b" className="bg-green-500">
            <div
              className="text-lg p-4"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              Flexbox 2
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </WidthProvider>
  );
};

export default Dashboard;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { Plus, Wrench, Circuitry, AlignLeft } from "@phosphor-icons/react";
import { USER_BACKGROUND_COLOR } from "@/utils/constants";
import useLogo from "@/hooks/useLogo";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function Sidebar() {
  const { logo } = useLogo();
  const navigate = useNavigate();

  const isNewingJob = useMatch("/");
  const isViewingJob = useMatch("/job/:jobId");
  const isViewingLog = useMatch("/logs");
  const isViewingSettings = useMatch("/settings/*");

  const handleNavigate = (path) => {
    switch (path) {
      case "/":
        navigate("/");
        break;
      case "logs":
        navigate("/logs");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <>
      <Link
        to={paths.home()}
        className="flex shrink-0 max-w-[100%] items-center justify-start mx-[4px] my-[16px]"
        aria-label="Home"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded h-[36px]"
          style={{ objectFit: "contain" }}
        />
      </Link>
      <div className="flex flex-col h-full overflow-x-hidden">
        <div className="flex-grow flex flex-col min-w-[24px] overflow-y-scroll no-scroll pb-8 gap-y-2">
          <div className="flex gap-x-2 items-center justify-between">
            <button
              onClick={() => {
                handleNavigate("/");
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-main rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <Circuitry
                color={isNewingJob || isViewingJob ? "#5f27cd" : "#748497"}
                size={28}
                weight="fill"
              />
            </button>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <button
              onClick={() => {
                handleNavigate("logs");
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-main rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <AlignLeft
                size={28}
                color={isViewingLog ? "#5f27cd" : "#748497"}
                weight="fill"
              />
            </button>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <button
              onClick={() => {
                handleNavigate("settings");
              }}
              className="flex flex-grow h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-main rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
            >
              <Wrench
                size={28}
                color={isViewingSettings ? "#5f27cd" : "#748497"}
                weight="fill"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

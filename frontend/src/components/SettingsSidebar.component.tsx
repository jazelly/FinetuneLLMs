import React, { useEffect, useRef, useState } from 'react';
import paths from '@/utils/paths';
import { EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function SettingsSidebar() {
  const sidebarRef = useRef(null);

  return (
    <div className="bg-main-menu bg-opacity-50">
      <div
        ref={sidebarRef}
        className="transition-all duration-500 h-full relative m-[16px] rounded-[16px] border-2 border-outline md:w-[235px] w-[68px] p-[10px]"
      >
        <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
          <div className="relative h-full flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
            <div className="h-auto sidebar-items">
              <div className="flex flex-col gap-y-2 h-full pb-8 overflow-y-scroll no-scroll">
                <SidebarOptions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Option = ({
  btnText,
  icon,
  href,
  childLinks = [],
  flex = false,
  allowedRole = [],
  subOptions = null,
  hidden = false,
}: any) => {
  if (hidden) return null;

  const hasActiveChild = childLinks.includes(window.location.pathname);
  const isActive = window.location.pathname === href;

  return (
    <>
      <div className="flex gap-x-2 items-center justify-between">
        <Link
          to={href}
          className={`
          transition-all duration-[200ms]
          flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-[4px] justify-start items-center
          hover:bg-workspace-item-selected-gradient hover:text-white hover:font-medium
          ${
            isActive
              ? 'bg-menu-item-selected-gradient font-medium border-outline text-white'
              : 'hover:bg-menu-item-selected-gradient text-zinc-200'
          }
        `}
        >
          {React.cloneElement(icon, { weight: isActive ? 'fill' : 'regular' })}
          <p className="max-md:hidden text-sm leading-loose whitespace-nowrap overflow-hidden ">
            {btnText}
          </p>
        </Link>
      </div>
      {!!subOptions && (isActive || hasActiveChild) && (
        <div
          className={`ml-4 ${
            hasActiveChild ? '' : 'border-l-2 border-slate-400'
          } rounded-r-lg`}
        >
          {subOptions}
        </div>
      )}
    </>
  );
};

const SidebarOptions = () => (
  <>
    <Option
      href={paths.settings.privacy}
      btnText="Privacy & Data"
      icon={<EyeSlash className="h-5 w-5 flex-shrink-0" />}
      flex={true}
      allowedRole={['admin']}
    />
  </>
);

import System from "@/models/system";
import paths from "@/utils/paths";
import {
  BookOpen,
  DiscordLogo,
  GithubLogo,
  Briefcase,
  Envelope,
  Globe,
  HouseLine,
  Info,
  LinkSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import React from "react";
import SettingsButton from "../SettingsButton";
import { isMobile } from "react-device-detect";
import UploadDatasets, { useUploadDatasetsModal } from "../Modals/UploadDatasets";

export const MAX_ICONS = 3;
export const ICON_COMPONENTS = {
  BookOpen: BookOpen,
  DiscordLogo: DiscordLogo,
  GithubLogo: GithubLogo,
  Envelope: Envelope,
  LinkSimple: LinkSimple,
  HouseLine: HouseLine,
  Globe: Globe,
  Briefcase: Briefcase,
  Info: Info,
};

export default function Footer() {
  const {showing: showingUpload, showModal: showUploadModal, hideModal: hideUploadModal} = useUploadDatasetsModal();

  console.log(showingUpload);

  return (
    <div className="flex justify-center mb-2">
      <div className="flex space-x-4">
        <a
          href={paths.github()}
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Find me on Github"
        >
          <GithubLogo weight="fill" className="h-5 w-5 " />
        </a>
        <div
          className="transition-all duration-300 p-2 cursor-pointer rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Upload your datasets"
          onClick={showUploadModal}
        >
          <UploadSimple weight="fill" className="h-5 w-5 " />
        </div>
        {!isMobile && <SettingsButton />}
      </div>
      
      {showingUpload && <UploadDatasets hideModal={hideUploadModal} />}
    </div>
  );

}

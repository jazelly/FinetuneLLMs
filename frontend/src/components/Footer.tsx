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
import SettingsButton from "./SettingsButton";

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

export default function Footer({ showUploadModal }) {
  return (
    <div className="flex justify-center my-2">
      <div className="flex space-x-4">
        <a
          href={paths.github()}
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 p-2 rounded-full text-white bg-main-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Find me on Github"
        >
          <GithubLogo weight="fill" className="h-5 w-5 " />
        </a>
        <div
          className="transition-all duration-300 p-2 cursor-pointer rounded-full text-white bg-main-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Upload your datasets"
          onClick={showUploadModal}
        >
          <UploadSimple weight="fill" className="h-5 w-5 " />
        </div>
        <SettingsButton />
      </div>
    </div>
  );
}

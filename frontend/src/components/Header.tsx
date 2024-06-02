import React, { useState } from "react";
import paths from "../utils/paths";
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
  FileArrowUp,
} from "@phosphor-icons/react";

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

function Header({ showUploadModal }: { showUploadModal: () => void }) {
  const [githubHover, setGithubHover] = useState<boolean>(false);
  const [uploadHover, setUploadHover] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-center pt-1 px-2 text-2xl h-full">
      <div className="header-title">FinetuneLLMs</div>
      <div
        id="header-right-logo"
        className="flex justify-center space-x-6 mr-2"
      >
        <div
          onMouseEnter={() => {
            setUploadHover(true);
          }}
          onMouseLeave={() => {
            setUploadHover(false);
          }}
          className="transition-all duration-300 p-2 rounded-xl bg-white shadow-sm border border-transparent cursor-pointer"
          aria-label="Upload your datasets"
          onClick={showUploadModal}
        >
          <FileArrowUp
            weight={uploadHover ? "fill" : "bold"}
            size={24}
            color="#737b85"
          />
        </div>
        <a
          href={paths.github()}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => {
            setGithubHover(true);
          }}
          onMouseLeave={() => {
            setGithubHover(false);
          }}
          className="transition-all duration-300 p-2 rounded-xl bg-white shadow-sm border border-transparent"
          aria-label="Find me on Github"
        >
          <GithubLogo
            weight={githubHover ? "fill" : "bold"}
            size={24}
            color="#737b85"
          />
        </a>
      </div>
    </div>
  );
}

export default Header;

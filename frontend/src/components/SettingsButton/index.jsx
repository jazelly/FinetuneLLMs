import paths from '@/utils/paths';
import { Wrench } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function SettingsButton() {
  return (
    <Link
      to={paths.settings.system()}
      className="transition-all duration-300 p-2 rounded-full text-white bg-main-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      aria-label="Settings"
    >
      <Wrench className="h-5 w-5" weight="fill" />
    </Link>
  );
}

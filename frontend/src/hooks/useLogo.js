import { useContext } from 'react';
import { LogoContext } from '@/contexts/LogoContext';

export default function useLogo() {
  const { logo, setLogo } = useContext(LogoContext);
  return { logo, setLogo };
}

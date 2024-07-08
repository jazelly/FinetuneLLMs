import { User } from '@phosphor-icons/react';
import React from 'react';

export interface UserIconProps {
  size: string;
  user: {
    name: string;
    role: 'ai' | 'user';
  };
}

export default function UserIcon({ size = 35, user }) {
  return (
    <div
      className={`relative w-[${size}px] h-[${size}px] rounded-full flex-shrink-0 overflow-hidden`}
    >
      <Avatar size={size} />
    </div>
  );
}

const Avatar = ({
  src,
  alt,
  size = 24,
}: {
  src?: string;
  alt?: string;
  size: number;
}) => {
  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center w-[${size}px] h-[${size}px]`}
    >
      {src && alt ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="text-gray-500" size={size} />
      )}
    </div>
  );
};

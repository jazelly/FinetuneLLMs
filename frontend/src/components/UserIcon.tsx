import { getRandomInitials } from '@/utils/misc';
import React, { useRef, useEffect } from 'react';
import Avatar from 'react-avatar';

export interface UserIconProps {
  size: string;
  user: {
    name: string;
    role: 'ai' | 'user';
  };
}

export default function UserIcon({ size = 35, user }) {
  const name =
    user?.role === 'ai'
      ? 'L L M'
      : user?.name
        ? user.name
        : getRandomInitials();
  return (
    <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
      <Avatar
        name={name}
        size={`${size}px`}
        round={true}
        textSizeRatio={2}
        maxInitials={3}
      />
    </div>
  );
}

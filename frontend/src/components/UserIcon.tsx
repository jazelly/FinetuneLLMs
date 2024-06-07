import { getInitials } from "@/utils/misc";
import React, { useRef, useEffect } from "react";
import Avatar from "react-avatar";

export interface UserIconProps {
  size: string;
  user: Record<string, any>;
}

export default function UserIcon({ size = "35px", user }) {
  const initials = getInitials(user?.name);
  return (
    <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
      <Avatar
        name={initials}
        size={size}
        round={true}
        textSizeRatio={2}
        maxInitials={2}
      />
    </div>
  );
}

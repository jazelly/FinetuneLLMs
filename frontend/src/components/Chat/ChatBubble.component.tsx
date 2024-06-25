import React from 'react';
import UserIcon from '../UserIcon';
import { userFromStorage } from '@/utils/request';
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from '@/utils/constants';
import { IChatMessage } from '@/types/common.type';

export default function ChatBubble({ message, role, id }: IChatMessage) {
  const isUser = role === 'user';
  const backgroundColor = isUser ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR;

  return (
    <div className={`flex justify-center items-end w-full ${backgroundColor}`}>
      <div className={`py-8 px-4 w-full flex md:max-w-[800px] flex-col`}>
        <div className="flex gap-x-5">
          <UserIcon
            size={36}
            user={{ role: isUser ? userFromStorage()?.username : 'ai' }}
          />

          <span
            className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

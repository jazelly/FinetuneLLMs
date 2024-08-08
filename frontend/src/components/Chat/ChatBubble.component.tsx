import React from 'react';
import UserIcon from '../UserIcon';
import { IChatMessage } from '@/types/common.type';
import AppIcon from '../reusable/AppIcon.component';

export default function ChatBubble({ message, role, id }: IChatMessage) {
  const isUser = role === 'user';

  return (
    <div className={`flex justify-center items-end w-full`}>
      <div className={`py-5 px-4 w-full flex md:max-w-[800px] flex-col`}>
        <div className="flex gap-x-5">
          <div data-id="chat-avatar-container" className="">
            {isUser ? (
              <UserIcon size={42} user={{ role: isUser ? 'anon' : 'ai' }} />
            ) : (
              <div className="rounded-full bg-stone-600 border-main-lightgray border p-1">
                <AppIcon size={32} color="#f0f2f4" />
              </div>
            )}
          </div>

          <span
            className={`whitespace-pre-line font-normal text-sm md:text-sm ${!isUser ? 'text-white' : 'text-gray320'} flex flex-col gap-y-1 mt-2`}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

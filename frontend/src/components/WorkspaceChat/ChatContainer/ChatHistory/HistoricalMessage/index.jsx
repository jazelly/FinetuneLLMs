import React, { memo } from 'react';
import { Warning } from '@phosphor-icons/react';
import Actions from './Actions';
import renderMarkdown from '@/utils/chat/markdown';
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from '@/utils/constants';
import { v4 } from 'uuid';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = ({
  uuid = v4(),
  message,
  role,
  workspace,
  sources = [],
  error = false,
  feedbackScore = null,
  chatId = null,
  isLastMessage = false,
  regenerateMessage,
}) => {
  return (
    <div
      key={uuid}
      className={`flex justify-center items-end w-full ${
        role === 'user' ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
      }`}
    >
      <div
        className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
      >
        <div className="flex gap-x-5">
          {error ? (
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <span className={`inline-block `}>
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {error}
              </p>
            </div>
          ) : (
            <span
              className={`flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
          )}
        </div>
        {role === 'assistant' && !error && (
          <div className="flex gap-x-5">
            <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
            <Actions
              message={DOMPurify.sanitize(message)}
              feedbackScore={feedbackScore}
              chatId={chatId}
              slug={workspace?.slug}
              isLastMessage={isLastMessage}
              regenerateMessage={regenerateMessage}
            />
          </div>
        )}
        {role === 'assistant' && <Citations sources={sources} />}
      </div>
    </div>
  );
};

export default memo(
  HistoricalMessage,
  // Skip re-render the historical message:
  // if the content is the exact same AND (not streaming)
  // the lastMessage status is the same (regen icon)
  // and the chatID matches between renders. (feedback icons)
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.isLastMessage === nextProps.isLastMessage &&
      prevProps.chatId === nextProps.chatId
    );
  }
);

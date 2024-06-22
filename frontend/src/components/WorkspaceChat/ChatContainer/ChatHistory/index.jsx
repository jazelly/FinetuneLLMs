import HistoricalMessage from './HistoricalMessage';
import PromptReply from './PromptReply';
import { useEffect, useRef, useState } from 'react';
import { useUploadDatasetsModal } from '../../../Modals/UploadDatasets';
import UploadDatasets from '../../../Modals/UploadDatasets';
import { ArrowDown } from '@phosphor-icons/react';
import debounce from 'lodash.debounce';
import useUser from '@/hooks/useUser';
import Chartable from './Chartable';

export default function ChatHistory({
  history = [],
  workspace,
  sendCommand,
  regenerateAssistantMessage,
}) {
  const { user } = useUser();
  const { showing, showModal, hideModal } = useUploadDatasetsModal();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatHistoryRef = useRef(null);
  const [textSize, setTextSize] = useState('normal');

  const getTextSizeClass = (size) => {
    switch (size) {
      case 'small':
        return 'text-[12px]';
      case 'large':
        return 'text-[18px]';
      default:
        return 'text-[14px]';
    }
  };

  useEffect(() => {
    const storedTextSize = window.localStorage.getItem('anythingllm_text_size');
    if (storedTextSize) {
      setTextSize(getTextSizeClass(storedTextSize));
    }

    const handleTextSizeChange = (event) => {
      const size = event.detail;
      setTextSize(getTextSizeClass(size));
    };

    window.addEventListener('textSizeChange', handleTextSizeChange);

    return () => {
      window.removeEventListener('textSizeChange', handleTextSizeChange);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) scrollToBottom();
  }, [history]);

  const handleScroll = () => {
    const diff =
      chatHistoryRef.current.scrollHeight -
      chatHistoryRef.current.scrollTop -
      chatHistoryRef.current.clientHeight;
    // Fuzzy margin for what qualifies as "bottom". Stronger than straight comparison since that may change over time.
    const isBottom = diff <= 10;
    setIsAtBottom(isBottom);
  };

  const debouncedScroll = debounce(handleScroll, 100);
  useEffect(() => {
    function watchScrollEvent() {
      if (!chatHistoryRef.current) return null;
      const chatHistoryElement = chatHistoryRef.current;
      if (!chatHistoryElement) return null;
      chatHistoryElement.addEventListener('scroll', debouncedScroll);
    }
    watchScrollEvent();
  }, []);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSendSuggestedMessage = (heading, message) => {
    sendCommand(`${heading} ${message}`, true);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col h-full md:mt-0 pb-44 md:pb-40 w-full justify-end items-center">
        <div className="flex flex-col items-center md:items-start md:max-w-[600px] w-full px-4">
          <p className="text-white/60 text-lg font-base py-4">
            Welcome to your new workspace.
          </p>
          {!user || user.role !== 'default' ? (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started either{' '}
              <span
                className="underline font-medium cursor-pointer"
                onClick={showModal}
              >
                upload a document
              </span>
              or <b className="font-medium italic">send a chat.</b>
            </p>
          ) : (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started <b className="font-medium italic">send a chat.</b>
            </p>
          )}
          <WorkspaceChatSuggestions
            suggestions={workspace?.suggestedMessages ?? []}
            sendSuggestion={handleSendSuggestedMessage}
          />
        </div>
        {showing && (
          <UploadDatasets hideModal={hideModal} providedSlug={workspace.slug} />
        )}
      </div>
    );
  }

  return (
    <div
      className={`markdown text-white/80 font-light ${textSize} h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col justify-start no-scroll`}
      id="chat-history"
      ref={chatHistoryRef}
    >
      {history.map((props, index) => {
        const isLastBotReply =
          index === history.length - 1 && props.role === 'assistant';

        if (props?.type === 'statusResponse' && !!props.content) {
          return <StatusResponse key={props.uuid} props={props} />;
        }

        if (props.type === 'rechartVisualize' && !!props.content) {
          return (
            <Chartable key={props.uuid} workspace={workspace} props={props} />
          );
        }

        if (isLastBotReply && props.animate) {
          return (
            <PromptReply
              key={props.uuid}
              uuid={props.uuid}
              reply={props.content}
              pending={props.pending}
              sources={props.sources}
              error={props.error}
              workspace={workspace}
              closed={props.closed}
            />
          );
        }

        return (
          <HistoricalMessage
            key={index}
            message={props.content}
            role={props.role}
            workspace={workspace}
            sources={props.sources}
            feedbackScore={props.feedbackScore}
            chatId={props.chatId}
            error={props.error}
            regenerateMessage={regenerateAssistantMessage}
            isLastMessage={isLastBotReply}
          />
        );
      })}
      {showing && (
        <UploadDatasets hideModal={hideModal} providedSlug={workspace.slug} />
      )}
      {!isAtBottom && (
        <div className="fixed bottom-40 right-10 md:right-20 z-50 cursor-pointer animate-pulse">
          <div className="flex flex-col items-center">
            <div className="p-1 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 hover:text-white">
              <ArrowDown
                weight="bold"
                className="text-white/60 w-5 h-5"
                onClick={scrollToBottom}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusResponse({ props }) {
  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
        <div className="flex gap-x-5">
          <span
            className={`text-xs inline-block p-2 rounded-lg text-white/60 font-mono whitespace-pre-line`}
          >
            {props.content}
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkspaceChatSuggestions({ suggestions = [], sendSuggestion }) {
  if (suggestions.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-xs mt-10 w-full justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="text-left p-2.5 border rounded-xl border-white/20 bg-main-base hover:bg-workspace-item-selected-gradient"
          onClick={() => sendSuggestion(suggestion.heading, suggestion.message)}
        >
          <p className="font-semibold">{suggestion.heading}</p>
          <p>{suggestion.message}</p>
        </button>
      ))}
    </div>
  );
}

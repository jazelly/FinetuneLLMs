import React, { useState, useRef, useEffect } from 'react';

import { isMobile } from 'react-device-detect';
import { PaperPlaneRight } from '@phosphor-icons/react';
import StopGenerationButton from './StopGeneratingButton.component';
import TextSizeButton from './TextSizeButton.component';

export const PROMPT_INPUT_EVENT = 'set_prompt_input';
export default function PromptInput({ submit, inputDisabled, buttonDisabled }) {
  const [promptInput, setPromptInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [_, setFocused] = useState(false);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = () => {
    // setFocused(false);
    if (promptInput.trim()) {
      submit(promptInput);
      setPromptInput('');
    }
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault();
      handleSubmit();
    } else if (
      (event.key === 'Enter' && event.ctrlKey) ||
      (event.key === 'Enter' && event.shiftKey)
    ) {
      event.preventDefault();
      setPromptInput(promptInput + '\n');
    }
  };

  const adjustTextArea = (event) => {
    if (isMobile) return false;
    const element = event.target;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [promptInput]);

  return (
    <div className="flex justify-center items-center py-4 px-12 w-full bg-transparent shadow-2xl">
      <div className="w-full bg-main-gradient shadow-2xl border border-white/50 rounded-2xl flex flex-col px-4 overflow-hidden">
        <div className="flex items-center w-full border-b-2 border-gray-500/50">
          <textarea
            ref={textareaRef}
            onChange={(e) => {
              setPromptInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            required={true}
            disabled={inputDisabled}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              adjustTextArea(e);
            }}
            value={promptInput}
            className="cursor-text max-h-[250px] md:min-h-[40px] mx-2 md:mx-0 py-2 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none flex-grow"
            placeholder={'Send a message'}
          />
          {buttonDisabled ? (
            <StopGenerationButton />
          ) : (
            <button
              className="inline-flex justify-center rounded-2xl cursor-pointer text-white/60 hover:text-white group ml-4"
              onClick={handleSubmit}
            >
              <PaperPlaneRight className="w-7 h-7 my-3" weight="fill" />
              <span className="sr-only">Send message</span>
            </button>
          )}
        </div>
        <div className="flex justify-between py-3.5">
          <div className="flex gap-x-2">
            <TextSizeButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ABORT_STREAM_EVENT = 'abort-chat-stream';

// For handling of chat responses in the frontend by their various types.
export default function handleChat(
  chatResult,
  setLoadingResponse,
  setChatHistory,
  remHistory,
  _chatHistory,
  setWebsocket
) {
  const {
    uuid,
    textResponse,
    type,
    sources = [],
    error,
    close,
    chatId = null,
    action = null,
  } = chatResult;

  if (type === 'abort' || type === 'statusResponse') {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        type,
        uuid,
        content: textResponse,
        role: 'assistant',
        sources,
        closed: true,
        error,
        animate: false,
        pending: false,
      },
    ]);
    _chatHistory.push({
      type,
      uuid,
      content: textResponse,
      role: 'assistant',
      sources,
      closed: true,
      error,
      animate: false,
      pending: false,
    });
  } else if (type === 'textResponse') {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        uuid,
        content: textResponse,
        role: 'assistant',
        sources,
        closed: close,
        error,
        animate: !close,
        pending: false,
        chatId,
      },
    ]);
    _chatHistory.push({
      uuid,
      content: textResponse,
      role: 'assistant',
      sources,
      closed: close,
      error,
      animate: !close,
      pending: false,
      chatId,
    });
  } else if (type === 'textResponseChunk') {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      const updatedHistory = {
        ...existingHistory,
        content: existingHistory.content + textResponse,
        sources,
        error,
        closed: close,
        animate: !close,
        pending: false,
        chatId,
      };
      _chatHistory[chatIdx] = updatedHistory;
    } else {
      _chatHistory.push({
        uuid,
        sources,
        error,
        content: textResponse,
        role: 'assistant',
        closed: close,
        animate: !close,
        pending: false,
        chatId,
      });
    }
    setChatHistory([..._chatHistory]);
  } else if (type === 'agentInitWebsocketConnection') {
    setWebsocket(chatResult.websocketUUID);
  } else if (type === 'finalizeResponseStream') {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      const updatedHistory = {
        ...existingHistory,
        chatId, // finalize response stream only has some specific keys for data. we are explicitly listing them here.
      };
      _chatHistory[chatIdx] = updatedHistory;
    }
    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  } else if (type === 'stopGeneration') {
    const chatIdx = _chatHistory.length - 1;
    const existingHistory = { ..._chatHistory[chatIdx] };
    const updatedHistory = {
      ...existingHistory,
      sources: [],
      closed: true,
      error: null,
      animate: false,
      pending: false,
    };
    _chatHistory[chatIdx] = updatedHistory;

    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  }

  // Action Handling via special 'action' attribute on response.
  if (action === 'reset_chat') {
    // Chat was reset, keep reset message and clear everything else.
    setChatHistory([_chatHistory.pop()]);
  }
}

export function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    'Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.'
  );
}

export function chatQueryRefusalResponse(workspace) {
  return (
    workspace?.queryRefusalResponse ??
    'There is no relevant information in this workspace to answer your query.'
  );
}

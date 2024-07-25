const translation = {
  pageTitle: {
    line1: 'PROMPT',
    line2: 'Engineering',
  },
  orchestrate: 'Orchestrate',
  promptMode: {
    simple: 'Switch to Expert Mode to edit the whole PROMPT',
    advanced: 'Expert Mode',
    switchBack: 'Switch back',
    advancedWarning: {
      title:
        'You have switched to Expert Mode, and once you modify the PROMPT, you CANNOT return to the basic mode.',
      description: 'In Expert Mode, you can edit whole PROMPT.',
      learnMore: 'Learn more',
      ok: 'OK',
    },
    operation: {
      addMessage: 'Add Message',
    },
    contextMissing:
      'Context component missed, the effectiveness of the prompt may not be good.',
  },
  operation: {
    applyConfig: 'Publish',
    resetConfig: 'Reset',
    debugConfig: 'Debug',
    addFeature: 'Add Feature',
    automatic: 'Automatic',
    stopResponding: 'Stop responding',
    agree: 'like',
    disagree: 'dislike',
    cancelAgree: 'Cancel like',
    cancelDisagree: 'Cancel dislike',
    userAction: 'User ',
  },
  notSetAPIKey: {
    title: 'LLM provider key has not been set',
    trailFinished: 'Trail finished',
    description:
      'The LLM provider key has not been set, and it needs to be set before debugging.',
    settingBtn: 'Go to settings',
  },
  trailUseGPT4Info: {
    title: 'Does not support gpt-4 now',
    description: 'Use gpt-4, please set API Key.',
  },
  feature: {
    groupChat: {
      title: 'Chat enhance',
      description:
        'Add pre-conversation settings for apps can enhance user experience.',
    },
    groupExperience: {
      title: 'Experience enhance',
    },
    conversationOpener: {
      title: 'Conversation remakers',
      description:
        'In a chat app, the first sentence that the AI actively speaks to the user is usually used as a welcome.',
    },
    suggestedQuestionsAfterAnswer: {
      title: 'Follow-up',
      description:
        'Setting up next questions suggestion can give users a better chat.',
      resDes: '3 suggestions for user next question.',
      tryToAsk: 'Try to ask',
    },
    moreLikeThis: {
      title: 'More like this',
      description:
        'Generate multiple texts at once, and then edit and continue to generate',
      generateNumTip: 'Number of each generated times',
      tip: 'Using this feature will incur additional tokens overhead',
    },
    speechToText: {
      title: 'Speech to Text',
      description: 'Once enabled, you can use voice input.',
      resDes: 'Voice input is enabled',
    },
    textToSpeech: {
      title: 'Text to Speech',
      description: 'Once enabled, text can be converted to speech.',
      resDes: 'Text to Audio is enabled',
    },
    citation: {
      title: 'Citations and Attributions',
      description:
        'Once enabled, show source document and attributed section of the generated content.',
      resDes: 'Citations and Attributions is enabled',
    },
    annotation: {
      title: 'Annotation Reply',
      description:
        'You can manually add high-quality response to the cache for prioritized matching with similar user questions.',
      resDes: 'Annotation Response is enabled',
      scoreThreshold: {
        title: 'Score Threshold',
        description:
          'Used to set the similarity threshold for annotation reply.',
        easyMatch: 'Easy Match',
        accurateMatch: 'Accurate Match',
      },
      matchVariable: {
        title: 'Match Variable',
        choosePlaceholder: 'Choose match variable',
      },
      cacheManagement: 'Annotations',
      cached: 'Annotated',
      remove: 'Remove',
      removeConfirm: 'Delete this annotation ?',
      add: 'Add annotation',
      edit: 'Edit annotation',
    },
    dataSet: {
      title: 'Context',
      noData: 'You can import Knowledge as context',
      words: 'Words',
      textBlocks: 'Text Blocks',
      selectTitle: 'Select reference Knowledge',
      selected: 'Knowledge selected',
      noDataSet: 'No Knowledge found',
      toCreate: 'Go to create',
      notSupportSelectMulti: 'Currently only support one Knowledge',
      queryVariable: {
        title: 'Query variable',
        tip: 'This variable will be used as the query input for context retrieval, obtaining context information related to the input of this variable.',
        choosePlaceholder: 'Choose query variable',
        noVar: 'No variables',
        noVarTip: 'please create a variable under the Variables section',
        unableToQueryDataSet: 'Unable to query the Knowledge',
        unableToQueryDataSetTip:
          'Unable to query the Knowledge successfully, please choose a context query variable in the context section.',
        ok: 'OK',
        contextVarNotEmpty: 'context query variable can not be empty',
        deleteContextVarTitle: 'Delete variable “{{varName}}”?',
        deleteContextVarTip:
          'This variable has been set as a context query variable, and removing it will impact the normal use of the Knowledge. If you still need to delete it, please reselect it in the context section.',
      },
    },
    tools: {
      title: 'Tools',
      tips: 'Tools provide a standard API call method, taking user input or variables as request parameters for querying external data as context.',
      toolsInUse: '{{count}} tools in use',
      modal: {
        title: 'Tool',
        toolType: {
          title: 'Tool Type',
          placeholder: 'Please select the tool type',
        },
        name: {
          title: 'Name',
          placeholder: 'Please enter the name',
        },
        variableName: {
          title: 'Variable Name',
          placeholder: 'Please enter the variable name',
        },
      },
    },
    conversationHistory: {
      title: 'Conversation History',
      description: 'Set prefix names for conversation roles',
      tip: 'The Conversation History is not enabled, please add <histories> in the prompt above.',
      learnMore: 'Learn more',
      editModal: {
        title: 'Edit Conversation Role Names',
        userPrefix: 'User prefix',
        assistantPrefix: 'Assistant prefix',
      },
    },
    toolbox: {
      title: 'TOOLBOX',
    },
    moderation: {
      title: 'Content moderation',
      description:
        'Secure model output by using moderation API or maintaining a sensitive word list.',
      allEnabled: 'INPUT/OUTPUT Content Enabled',
      inputEnabled: 'INPUT Content Enabled',
      outputEnabled: 'OUTPUT Content Enabled',
      modal: {
        title: 'Content moderation settings',
        provider: {
          title: 'Provider',
          openai: 'OpenAI Moderation',
          openaiTip: {
            prefix:
              'OpenAI Moderation requires an OpenAI API key configured in the ',
            suffix: '.',
          },
          keywords: 'Keywords',
        },
        keywords: {
          tip: 'One per line, separated by line breaks. Up to 100 characters per line.',
          placeholder: 'One per line, separated by line breaks',
          line: 'Line',
        },
        content: {
          input: 'Moderate INPUT Content',
          output: 'Moderate OUTPUT Content',
          preset: 'Preset replies',
          placeholder: 'Preset replies content here',
          condition: 'Moderate INPUT and OUTPUT Content enabled at least one',
          fromApi: 'Preset replies are returned by API',
          errorMessage: 'Preset replies cannot be empty',
          supportMarkdown: 'Markdown supported',
        },
        openaiNotConfig: {
          before:
            'OpenAI Moderation requires an OpenAI API key configured in the',
          after: '',
        },
      },
    },
  },
  automatic: {
    title: 'Automated application orchestration',
    description:
      'Describe your scenario, Dify will orchestrate an application for you.',
    intendedAudience: 'Who is the intended audience?',
    intendedAudiencePlaceHolder: 'e.g. Student',
    solveProblem: 'What problems do they hope AI can solve for them?',
    solveProblemPlaceHolder:
      'e.g. Extract insights and summarize information from long reports and articles',
    generate: 'Generate',
    audiencesRequired: 'Audiences required',
    problemRequired: 'Problem required',
    resTitle: 'We have orchestrated the following application for you.',
    apply: 'Apply this orchestration',
    noData:
      'Describe your use case on the left, the orchestration preview will show here.',
    loading: 'Orchestrating the application for you...',
    overwriteTitle: 'Override existing configuration?',
    overwriteMessage:
      'Applying this orchestration will override existing configuration.',
  },
  resetConfig: {
    title: 'Confirm reset?',
    message:
      'Reset discards changes, restoring the last published configuration.',
  },
  errorMessage: {
    nameOfKeyRequired: 'name of the key: {{key}} required',
    valueOfVarRequired: '{{key}} value can not be empty',
    queryRequired: 'Request text is required.',
    waitForResponse:
      'Please wait for the response to the previous message to complete.',
    waitForBatchResponse:
      'Please wait for the response to the batch task to complete.',
    notSelectModel: 'Please choose a model',
    waitForImgUpload: 'Please wait for the image to upload',
  },
  chatSubTitle: 'Instructions',
  completionSubTitle: 'Prefix Prompt',
  promptTip:
    "Prompts guide AI responses with instructions and constraints. Insert variables like {{input}}. This prompt won't be visible to users.",
  formattingChangedTitle: 'Formatting changed',
  formattingChangedText:
    'Modifying the formatting will reset the debug area, are you sure?',
  variableTitle: 'Variables',
  variableTip:
    'Users fill variables in a form, automatically replacing variables in the prompt.',
  notSetVar:
    'Variables allow users to introduce prompt words or opening remarks when filling out forms. You can try entering "{{input}}" in the prompt words.',
  autoAddVar:
    'Undefined variables referenced in pre-prompt, are you want to add them in user input form?',
  variableTable: {
    key: 'Variable Key',
    name: 'User Input Field Name',
    optional: 'Optional',
    type: 'Input Type',
    action: 'Actions',
    typeString: 'String',
    typeSelect: 'Select',
  },
  varKeyError: {
    canNoBeEmpty: 'Variable key can not be empty',
    tooLong:
      'Variable key: {{key}} too length. Can not be longer then 30 characters',
    notValid:
      'Variable key: {{key}} is invalid. Can only contain letters, numbers, and underscores',
    notStartWithNumber: 'Variable key: {{key}} can not start with a number',
    keyAlreadyExists: 'Variable key: :{{key}} already exists',
  },
  otherError: {
    promptNoBeEmpty: 'Prompt can not be empty',
    historyNoBeEmpty: 'Conversation history must be set in the prompt',
    queryNoBeEmpty: 'Query must be set in the prompt',
  },
  variableConig: {
    addModalTitle: 'Add Input Field',
    editModalTitle: 'Edit Input Field',
    description: 'Setting for variable {{varName}}',
    fieldType: 'Field type',
    string: 'Short Text',
    'text-input': 'Short Text',
    paragraph: 'Paragraph',
    select: 'Select',
    number: 'Number',
    notSet: 'Not set, try typing {{input}} in the prefix prompt',
    stringTitle: 'Form text box options',
    maxLength: 'Max length',
    options: 'Options',
    addOption: 'Add option',
    apiBasedVar: 'API-based Variable',
    varName: 'Variable Name',
    labelName: 'Label Name',
    inputPlaceholder: 'Please input',
    content: 'Content',
    required: 'Required',
    errorMsg: {
      varNameRequired: 'Variable name is required',
      labelNameRequired: 'Label name is required',
      varNameCanBeRepeat: 'Variable name can not be repeated',
      atLeastOneOption: 'At least one option is required',
      optionRepeat: 'Has repeat options',
    },
  },
  vision: {
    name: 'Vision',
    description:
      'Enable Vision will allows the model to take in images and answer questions about them. ',
    settings: 'Settings',
    visionSettings: {
      title: 'Vision Settings',
      resolution: 'Resolution',
      resolutionTooltip: `low res will allow model receive a low-res 512 x 512 version of the image, and represent the image with a budget of 65 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that do not require high detail.
      \n
      high res will first allows the model to see the low res image and then creates detailed crops of input images as 512px squares based on the input image size. Each of the detailed crops uses twice the token budget for a total of 129 tokens.`,
      high: 'High',
      low: 'Low',
      uploadMethod: 'Upload Method',
      both: 'Both',
      localUpload: 'Local Upload',
      url: 'URL',
      uploadLimit: 'Upload Limit',
    },
  },
  voice: {
    name: 'Voice',
    defaultDisplay: 'Default Voice',
    description: 'Text to speech voice Settings',
    settings: 'Settings',
    voiceSettings: {
      title: 'Voice Settings',
      language: 'Language',
      resolutionTooltip: 'Text-to-speech voice support language。',
      voice: 'Voice',
    },
  },
  openingStatement: {
    title: 'Conversation Opener',
    add: 'Add',
    writeOpener: 'Write opener',
    placeholder:
      'Write your opener message here, you can use variables, try type {{variable}}.',
    openingQuestion: 'Opening Questions',
    noDataPlaceHolder:
      'Starting the conversation with the user can help AI establish a closer connection with them in conversational applications.',
    varTip: 'You can use variables, try type {{variable}}',
    tooShort:
      'At least 20 words of initial prompt are required to generate an opening remarks for the conversation.',
    notIncludeKey:
      'The initial prompt does not include the variable: {{key}}. Please add it to the initial prompt.',
  },
  modelConfig: {
    model: 'Model',
    setTone: 'Set tone of responses',
    title: 'Model and Parameters',
    modeType: {
      chat: 'Chat',
      completion: 'Complete',
    },
  },
  inputs: {
    title: 'Debug and Preview',
    noPrompt: 'Try write some prompt in pre-prompt input',
    userInputField: 'User Input Field',
    noVar:
      'Fill in the value of the variable, which will be automatically replaced in the prompt word every time a new session is started.',
    chatVarTip:
      'Fill in the value of the variable, which will be automatically replaced in the prompt word every time a new session is started',
    completionVarTip:
      'Fill in the value of the variable, which will be automatically replaced in the prompt words every time a question is submitted.',
    previewTitle: 'Prompt preview',
    queryTitle: 'Query content',
    queryPlaceholder: 'Please enter the request text.',
    run: 'RUN',
  },
  result: 'Output Text',
  datasetConfig: {
    settingTitle: 'Retrieval settings',
    knowledgeTip: 'Click the “+” button to add knowledge',
    retrieveOneWay: {
      title: 'N-to-1 retrieval',
      description:
        'Based on user intent and Knowledge descriptions, the Agent autonomously selects the best Knowledge for querying. Best for applications with distinct, limited Knowledge.',
    },
    retrieveMultiWay: {
      title: 'Multi-path retrieval',
      description:
        'Based on user intent, queries across all Knowledge, retrieves relevant text from multi-sources, and selects the best results matching the user query after reranking. Configuration of the Rerank model API is required.',
    },
    rerankModelRequired: 'Rerank model is required',
    params: 'Params',
    top_k: 'Top K',
    top_kTip:
      'Used to filter chunks that are most similar to user questions. The system will also dynamically adjust the value of Top K, according to max_tokens of the selected model.',
    score_threshold: 'Score Threshold',
    score_thresholdTip:
      'Used to set the similarity threshold for chunks filtering.',
    retrieveChangeTip:
      'Modifying the index mode and retrieval mode may affect applications associated with this Knowledge.',
  },
  debugAsSingleModel: 'Debug as Single Model',
  debugAsMultipleModel: 'Debug as Multiple Models',
  duplicateModel: 'Duplicate',
  publishAs: 'Publish as',
  assistantType: {
    name: 'Assistant Type',
    chatAssistant: {
      name: 'Basic Assistant',
      description: 'Build a chat-based assistant using a Large Language Model',
    },
    agentAssistant: {
      name: 'Agent Assistant',
      description:
        'Build an intelligent Agent which can autonomously choose tools to complete the tasks',
    },
  },
  agent: {
    agentMode: 'Agent Mode',
    agentModeDes: 'Set the type of inference mode for the agent',
    agentModeType: {
      ReACT: 'ReAct',
      functionCall: 'Function Calling',
    },
    setting: {
      name: 'Agent Settings',
      description:
        'Agent Assistant settings allow setting agent mode and advanced features like built-in prompts, only available in Agent type.',
      maximumIterations: {
        name: 'Maximum Iterations',
        description:
          'Limit the number of iterations an agent assistant can execute',
      },
    },
    buildInPrompt: 'Build-In Prompt',
    firstPrompt: 'First Prompt',
    nextIteration: 'Next Iteration',
    promptPlaceholder: 'Write your prompt here',
    tools: {
      name: 'Tools',
      description:
        'Using tools can extend the capabilities of LLM, such as searching the internet or performing scientific calculations',
      enabled: 'Enabled',
    },
  },
};

export default translation;

const translation = {
  steps: {
    header: {
      creation: 'Create Knowledge',
      update: 'Add data',
    },
    one: 'Choose data source',
    two: 'Text Preprocessing and Cleaning',
    three: 'Execute and finish',
  },
  error: {
    unavailable: 'This Knowledge is not available',
  },
  stepOne: {
    filePreview: 'File Preview',
    pagePreview: 'Page Preview',
    dataSourceType: {
      file: 'Import from text file',
      notion: 'Sync from Notion',
      web: 'Sync from website',
    },
    uploader: {
      title: 'Upload text file',
      button: 'Drag and drop file, or',
      browse: 'Browse',
      tip: 'Supports {{supportTypes}}. Max {{size}}MB each.',
      validation: {
        typeError: 'File type not supported',
        size: 'File too large. Maximum is {{size}}MB',
        count: 'Multiple files not supported',
        filesNumber:
          'You have reached the batch upload limit of {{filesNumber}}.',
      },
      cancel: 'Cancel',
      change: 'Change',
      failed: 'Upload failed',
    },
    notionSyncTitle: 'Notion is not connected',
    notionSyncTip:
      'To sync with Notion, connection to Notion must be established first.',
    connect: 'Go to connect',
    button: 'next',
    emptyDatasetCreation: 'I want to create an empty Knowledge',
    modal: {
      title: 'Create an empty Knowledge',
      tip: 'An empty Knowledge will contain no documents, and you can upload documents any time.',
      input: 'Knowledge name',
      placeholder: 'Please input',
      nameNotEmpty: 'Name cannot be empty',
      nameLengthInvaild: 'Name must be between 1 to 40 characters',
      cancelButton: 'Cancel',
      confirmButton: 'Create',
      failed: 'Creation failed',
    },
  },
  stepTwo: {
    segmentation: 'Chunk settings',
    auto: 'Automatic',
    autoDescription:
      'Automatically set chunk and preprocessing rules. Unfamiliar users are recommended to select this.',
    custom: 'Custom',
    customDescription:
      'Customize chunks rules, chunks length, and preprocessing rules, etc.',
    separator: 'Segment identifier',
    separatorPlaceholder:
      'For example, newline (\\\\n) or special separator (such as "***")',
    maxLength: 'Maximum chunk length',
    overlap: 'Chunk overlap',
    overlapTip:
      'Setting the chunk overlap can maintain the semantic relevance between them, enhancing the retrieve effect. It is recommended to set 10%-25% of the maximum chunk size.',
    overlapCheck: 'chunk overlap should not bigger than maximun chunk length',
    rules: 'Text preprocessing rules',
    removeExtraSpaces: 'Replace consecutive spaces, newlines and tabs',
    removeUrlEmails: 'Delete all URLs and email addresses',
    removeStopwords: 'Remove stopwords such as "a", "an", "the"',
    preview: 'Confirm & Preview',
    reset: 'Reset',
    indexMode: 'Index mode',
    qualified: 'High Quality',
    recommend: 'Recommend',
    qualifiedTip:
      'Call default system embedding interface for processing to provide higher accuracy when users query.',
    warning: 'Please set up the model provider API key first.',
    click: 'Go to settings',
    economical: 'Economical',
    economicalTip:
      'Use offline vector engines, keyword indexes, etc. to reduce accuracy without spending tokens',
    QATitle: 'Segmenting in Question & Answer format',
    QATip: 'Enable this option will consume more tokens',
    QALanguage: 'Segment using',
    emstimateCost: 'Estimation',
    emstimateSegment: 'Estimated chunks',
    segmentCount: 'chunks',
    calculating: 'Calculating...',
    fileSource: 'Preprocess documents',
    notionSource: 'Preprocess pages',
    other: 'and other ',
    fileUnit: ' files',
    notionUnit: ' pages',
    previousStep: 'Previous step',
    nextStep: 'Save & Process',
    save: 'Save & Process',
    cancel: 'Cancel',
    sideTipTitle: 'Why chunk and preprocess?',
    sideTipP1:
      'When processing text data, chunk and cleaning are two important preprocessing steps.',
    sideTipP2:
      'Segmentation splits long text into paragraphs so models can understand better. This improves the quality and relevance of model results.',
    sideTipP3:
      'Cleaning removes unnecessary characters and formats, making Knowledge cleaner and easier to parse.',
    sideTipP4:
      'Proper chunk and cleaning improve model performance, providing more accurate and valuable results.',
    previewTitle: 'Preview',
    previewTitleButton: 'Preview',
    previewButton: 'Switching to Q&A format',
    previewSwitchTipStart:
      'The current chunk preview is in text format, switching to a question-and-answer format preview will',
    previewSwitchTipEnd: ' consume additional tokens',
    characters: 'characters',
    indexSettedTip: 'To change the index method, please go to the ',
    retrivalSettedTip: 'To change the index method, please go to the ',
    datasetSettingLink: 'Knowledge settings.',
  },
  stepThree: {
    creationTitle: '🎉 Knowledge created',
    creationContent:
      'We automatically named the Knowledge, you can modify it at any time',
    label: 'Knowledge name',
    additionTitle: '🎉 Document uploaded',
    additionP1: 'The document has been uploaded to the Knowledge',
    additionP2: ', you can find it in the document list of the Knowledge.',
    stop: 'Stop processing',
    resume: 'Resume processing',
    navTo: 'Go to document',
    sideTipTitle: "What's next",
    sideTipContent:
      'After the document finishes indexing, the Knowledge can be integrated into the application as context, you can find the context setting in the prompt orchestration page. You can also create it as an independent ChatGPT indexing plugin for release.',
    modelTitle: 'Are you sure to stop embedding?',
    modelContent:
      'If you need to resume processing later, you will continue from where you left off.',
    modelButtonConfirm: 'Confirm',
    modelButtonCancel: 'Cancel',
  },
};

export default translation;

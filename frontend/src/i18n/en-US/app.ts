const translation = {
  createApp: 'CREATE APP',
  types: {
    all: 'All',
    chatbot: 'Chatbot',
    agent: 'Agent',
    workflow: 'Workflow',
    completion: 'Completion',
  },
  duplicate: 'Duplicate',
  duplicateTitle: 'Duplicate App',
  export: 'Export DSL',
  exportFailed: 'Export DSL failed.',
  importDSL: 'Import DSL file',
  createFromConfigFile: 'Create from DSL file',
  deleteAppConfirmTitle: 'Delete this app?',
  deleteAppConfirmContent:
    'Deleting the app is irreversible. Users will no longer be able to access your app, and all prompt configurations and logs will be permanently deleted.',
  appDeleted: 'App deleted',
  appDeleteFailed: 'Failed to delete app',
  join: 'Join the community',
  communityIntro:
    'Discuss with team members, contributors and developers on different channels.',
  roadmap: 'See our roadmap',
  newApp: {
    startFromBlank: 'Create from Blank',
    startFromTemplate: 'Create from Template',
    captionAppType: 'What type of app do you want to create?',
    chatbotDescription:
      'Build a chat-based application. This app uses a question-and-answer format, allowing for multiple rounds of continuous conversation.',
    completionDescription:
      'Build an application that generates high-quality text based on prompts, such as generating articles, summaries, translations, and more.',
    completionWarning: 'This type of app will no longer be supported.',
    agentDescription:
      'Build an intelligent Agent which can autonomously choose tools to complete the tasks',
    workflowDescription:
      'Build an application that generates high-quality text based on workflow orchestrates with a high degree of customization. It is suitable for experienced users.',
    workflowWarning: 'Currently in beta',
    chatbotType: 'Chatbot orchestrate method',
    basic: 'Basic',
    basicTip: 'For beginners, can switch to Chatflow later',
    basicFor: 'FOR BEGINNERS',
    basicDescription:
      'Basic Orchestrate allows for the orchestration of a Chatbot app using simple settings, without the ability to modify built-in prompts. It is suitable for beginners.',
    advanced: 'Chatflow',
    advancedFor: 'For advanced users',
    advancedDescription:
      'Workflow Orchestrate orchestrates Chatbots in the form of workflows, offering a high degree of customization, including the ability to edit built-in prompts. It is suitable for experienced users.',
    captionName: 'App icon & name',
    appNamePlaceholder: 'Give your app a name',
    captionDescription: 'Description',
    appDescriptionPlaceholder: 'Enter the description of the app',
    useTemplate: 'Use this template',
    previewDemo: 'Preview demo',
    chatApp: 'Assistant',
    chatAppIntro:
      'I want to build a chat-based application. This app uses a question-and-answer format, allowing for multiple rounds of continuous conversation.',
    agentAssistant: 'New Agent Assistant',
    completeApp: 'Text Generator',
    completeAppIntro:
      'I want to create an application that generates high-quality text based on prompts, such as generating articles, summaries, translations, and more.',
    showTemplates: 'I want to choose from a template',
    hideTemplates: 'Go back to mode selection',
    Create: 'Create',
    Cancel: 'Cancel',
    nameNotEmpty: 'Name cannot be empty',
    appTemplateNotSelected: 'Please select a template',
    appTypeRequired: 'Please select an app type',
    appCreated: 'App created',
    appCreateFailed: 'Failed to create app',
  },
  editApp: 'Edit Info',
  editAppTitle: 'Edit App Info',
  editDone: 'App info updated',
  editFailed: 'Failed to update app info',
  emoji: {
    ok: 'OK',
    cancel: 'Cancel',
  },
  switch: 'Switch to Workflow Orchestrate',
  switchTipStart:
    'A new app copy will be created for you, and the new copy will switch to Workflow Orchestrate. The new copy will ',
  switchTip: 'not allow',
  switchTipEnd: ' switching back to Basic Orchestrate.',
  switchLabel: 'The app copy to be created',
  removeOriginal: 'Delete the original app',
  switchStart: 'Start swtich',
  typeSelector: {
    all: 'ALL Types',
    chatbot: 'Chatbot',
    agent: 'Agent',
    workflow: 'Workflow',
    completion: 'Completion',
  },
};

export default translation;

const translation = {
  common: {
    welcome: '欢迎使用',
    appUnavailable: '应用不可用',
    appUnkonwError: '应用不可用',
  },
  chat: {
    newChat: '新对话',
    pinnedTitle: '已置顶',
    unpinnedTitle: '对话列表',
    newChatDefaultName: '新的对话',
    resetChat: '重置对话',
    powerBy: 'Powered by',
    prompt: '提示词',
    privatePromptConfigTitle: '对话设置',
    publicPromptConfigTitle: '对话前提示词',
    configStatusDes: '开始前，您可以修改对话设置',
    configDisabled: '此次会话已使用上次会话表单',
    startChat: '开始对话',
    privacyPolicyLeft: '请阅读由该应用开发者提供的',
    privacyPolicyMiddle: '隐私政策',
    privacyPolicyRight: '。',
    deleteConversation: {
      title: '删除对话',
      content: '您确定要删除此对话吗？',
    },
    tryToSolve: '尝试解决',
    temporarySystemIssue: '抱歉，临时系统问题。',
  },
  generation: {
    tabs: {
      create: '运行一次',
      batch: '批量运行',
      saved: '已保存',
    },
    savedNoData: {
      title: '您还没有保存结果！',
      description: '开始生成内容，您可以在这里找到保存的结果。',
      startCreateContent: '开始生成内容',
    },
    title: 'AI 智能书写',
    queryTitle: '查询内容',
    completionResult: '生成结果',
    queryPlaceholder: '请输入文本内容',
    run: '运行',
    copy: '拷贝',
    resultTitle: 'AI 书写',
    noData: 'AI 会在这里给你惊喜。',
    csvUploadTitle: '将您的 CSV 文件拖放到此处，或',
    browse: '浏览',
    csvStructureTitle: 'CSV 文件必须符合以下结构：',
    downloadTemplate: '下载模板',
    field: '',
    batchFailed: {
      info: '{{num}} 次运行失败',
      retry: '重试',
      outputPlaceholder: '无输出内容',
    },
    errorMsg: {
      empty: '上传文件的内容不能为空',
      fileStructNotMatch: '上传文件的内容与结构不匹配',
      emptyLine: '第 {{rowIndex}} 行的内容为空',
      invalidLine: '第 {{rowIndex}} 行: {{varName}}值必填',
      moreThanMaxLengthLine:
        '第 {{rowIndex}} 行: {{varName}}值超过最大长度 {{maxLength}}',
      atLeastOne: '上传文件的内容不能少于一条',
    },
  },
};

export default translation;

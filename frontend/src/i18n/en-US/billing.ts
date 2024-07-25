const translation = {
  currentPlan: 'Current Plan',
  upgradeBtn: {
    plain: 'Upgrade Plan',
    encourage: 'Upgrade Now',
    encourageShort: 'Upgrade',
  },
  viewBilling: 'Manage billing and subscriptions',
  buyPermissionDeniedTip:
    'Please contact your enterprise administrator to subscribe',
  plansCommon: {
    title: 'Choose a plan that’s right for you',
    yearlyTip: 'Get 2 months for free by subscribing yearly!',
    mostPopular: 'Most Popular',
    planRange: {
      monthly: 'Monthly',
      yearly: 'Yearly',
    },
    month: 'month',
    year: 'year',
    save: 'Save ',
    free: 'Free',
    currentPlan: 'Current Plan',
    contractSales: 'Contact sales',
    contractOwner: 'Contact team manager',
    startForFree: 'Start for free',
    getStartedWith: 'Get started with ',
    contactSales: 'Contact Sales',
    talkToSales: 'Talk to Sales',
    modelProviders: 'Model Providers',
    teamMembers: 'Team Members',
    annotationQuota: 'Annotation Quota',
    buildApps: 'Build Apps',
    vectorSpace: 'Vector Space',
    vectorSpaceBillingTooltip:
      'Each 1MB can store about 1.2million characters of vectorized data(estimated using OpenAI Embeddings, varies across models).',
    vectorSpaceTooltip:
      'Vector Space is the long-term memory system required for LLMs  to comprehend your data.',
    documentsUploadQuota: 'Documents Upload Quota',
    documentProcessingPriority: 'Document Processing Priority',
    documentProcessingPriorityTip:
      'For higher document processing priority, please upgrade your plan.',
    documentProcessingPriorityUpgrade:
      'Process more data with higher accuracy at faster speeds.',
    priority: {
      standard: 'Standard',
      priority: 'Priority',
      'top-priority': 'Top Priority',
    },
    logsHistory: 'Logs history',
    customTools: 'Custom Tools',
    unavailable: 'Unavailable',
    days: 'days',
    unlimited: 'Unlimited',
    support: 'Support',
    supportItems: {
      communityForums: 'Community forums',
      emailSupport: 'Email support',
      priorityEmail: 'Priority email & chat support',
      logoChange: 'Logo change',
      SSOAuthentication: 'SSO authentication',
      personalizedSupport: 'Personalized support',
      dedicatedAPISupport: 'Dedicated API support',
      customIntegration: 'Custom integration and support',
      ragAPIRequest: 'RAG API Requests',
      bulkUpload: 'Bulk upload documents',
      agentMode: 'Agent Mode',
      workflow: 'Workflow',
    },
    comingSoon: 'Coming soon',
    member: 'Member',
    memberAfter: 'Member',
    messageRequest: {
      title: 'Message Credits',
      tooltip:
        'Message invocation quotas for various plans using OpenAI models (except gpt4).Messages over the limit will use your OpenAI API Key.',
    },
    annotatedResponse: {
      title: 'Annotation Quota Limits',
      tooltip:
        'Manual editing and annotation of responses provides customizable high-quality question-answering abilities for apps. (Applicable only in chat apps)',
    },
    ragAPIRequestTooltip:
      'Refers to the number of API calls invoking only the knowledge base processing capabilities of Dify.',
    receiptInfo:
      'Only team owner and team admin can subscribe and view billing information',
  },
  plans: {
    sandbox: {
      name: 'Sandbox',
      description: '200 times GPT free trial',
      includesTitle: 'Includes:',
    },
    professional: {
      name: 'Professional',
      description:
        'For individuals and small teams to unlock more power affordably.',
      includesTitle: 'Everything in free plan, plus:',
    },
    team: {
      name: 'Team',
      description: 'Collaborate without limits and enjoy top-tier performance.',
      includesTitle: 'Everything in Professional plan, plus:',
    },
    enterprise: {
      name: 'Enterprise',
      description:
        'Get full capabilities and support for large-scale mission-critical systems.',
      includesTitle: 'Everything in Team plan, plus:',
    },
  },
  vectorSpace: {
    fullTip: 'Vector Space is full.',
    fullSolution: 'Upgrade your plan to get more space.',
  },
  apps: {
    fullTipLine1: 'Upgrade your plan to',
    fullTipLine2: 'build more apps.',
  },
  annotatedResponse: {
    fullTipLine1: 'Upgrade your plan to',
    fullTipLine2: 'annotate more conversations.',
    quotaTitle: 'Annotation Reply Quota',
  },
};

export default translation;

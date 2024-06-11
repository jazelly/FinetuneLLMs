export const BASE_MODELS = [
  "NousResearch/Llama-2-7b-chat-hf",
  "NousResearch/Meta-Llama-3-8B",
  "microsoft/Phi-3-mini-4k-instruct",
];

export const TRAINING_METHODS = [
  {
    name: "SFT",
    fullName: "Supervised Fine-Tuning",
    explanation:
      "SFT is the process of adapting a pre-trained model to a specific task using labeled data.",
    externalLink: "https://huggingface.co/docs/trl/main/en/sft_trainer",
  },
  {
    name: "ORPO",
    fullName: "Odds Ratio Preference Optimization",
    explanation:
      "Odds Ratio Preference Optimization (ORPO) by Jiwoo Hong, Noah Lee, and James Thorne studies the crucial role of SFT within the context of preference alignment. " +
      "Using preference data the method posits that a minor penalty for the disfavored generation together with a strong adaption signal to the chosen response via a simple " +
      "log odds ratio term appended to the NLL loss is sufficient for preference-aligned SFT.",
    externalLink: "https://huggingface.co/docs/trl/main/en/orpo_trainer",
  },
];

export const EXAMPLE_DATASETS = [
  {
    name: "mlabonne/orpo-dpo-mix-40k",
    features: ["source", "chosen", "rejected", "prompt", "question"],
    numRows: 40000,
  },
  { name: "mlabonne/guanaco-llama2-1k", features: ["text"], numRows: 1000 },
  {
    name: "soulhq-ai/insuranceQA-v2",
    features: ["input", "output"],
    numRows: 21300,
  },
];

# FinetuneLLMs (Work in Progress, Actively! 🔥)

Finetune an LLM, within a few clicks!

## 🔥Goal & Roadmap🔥

The main objective of this project is to lower the barrier to training large language models, especially for startup companies that have hardware in hands. With this project, it should be easy for a company to start experimenting with LLM training within a basic setup on servers with GPU/CPU resources.

In a way, it helps provide an opportunity for everyone who has hardware available and wants to utilize it in the AI field.

### [Roadmap](https://github.com/users/jazelly/projects/1/views/1)

## Supported finetuning techniques

| Model \ Method | SFT | DPO | ORPO | KTO | PRO |
| -------------- | --- | --- | ---- | --- | --- |
| llama 2        | ✅  | ❌  | ❌   | ❌  | ❌  |
| llama 3        | ✅  | ❌  | ✅   | ❌  | ❌  |
| gguf           | ✅  | ❌  | ❌   | ❌  | ❌  |
| phi-3          | ✅  | ❌  | ❌   | ❌  | ❌  |
| Mistral        | ✅  | ✅  | ❌   | ❌  | ❌  |
| ...            | ?   | ?   | ?    | ?   | ?   |

## General Setup

This repo provides 3 modules, `frontend `(react), `server` (nodejs), and `trainer` (python django)

You need CUDA for now, but once llama.cpp is integrated, this will no longer be required.

- For Linux

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

- For Windows (with Nvidia GPU)

  Enable WSL2 on your machine.

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

## Dev Setup

Setup frontend

```
// copy .env.example to .env
cd frontend
npm ci
npm run dev
// or yarn && yarn dev
```

Setup server

```
// copy .env.example to .env and .env.development
cd server
npx prisma migrate dev
yarn
yarn dev
```

Setup trainer

```
cd trainer
pip install -r requirements.txt
daphne trainer.asgi:application
```

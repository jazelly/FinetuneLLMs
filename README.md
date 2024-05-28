# FinetuneLLMs (Work in Progress, Actively!)

Finetune an LLM model with your dataset, within a few clicks!

## Supported finetuning techniques

| Model \ Method | SFT | DPO | ORPO | KTO | PRO |
| -------------- | --- | --- | ---- | --- | --- |
| llama 2        | ✅  | ❌  | ❌   | ❌  | ❌  |
| llama 3        | ✅  | ❌  | ✅   | ❌  | ❌  |
| gguf           | ✅  | ❌  | ❌   | ❌  | ❌  |
| phi-3          | ✅  | ❌  | ❌   | ❌  | ❌  |
| Mistral        | ✅  | ✅  | ❌   | ❌  | ❌  |
| ...            | ?   | ?   | ?    | ?   | ?   |

## General Setup (deprecating, will provide a UI usage documentation)

This repo provides 3 modules, `frontend `(react), `server` (nodejs), and `trainer` (python django)

You need CUDA for now, but once llama.cpp is integrated, this will no longer be required.

- For Linux

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

- For Windows (with Nvidia GPU)

  Enable WSL2 on your machine.

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

Setup frontend

```
// copy .env.example to .env
cd frontend
yarn dev
```

Setup server

```
// copy .env.example to .env
cd server
npx prisma migrate dev --name add_datasets_model
yarn dev
```

Setup trainer

```
cd trainer
pip install -r requirements.txt
python manage runserver
```

## TODO

- [x] Support training at GGUF level
- [x] Support `llama.cpp`
- [ ] Expose a finetune script as API and GUI for CUDA (WIP)
- [ ] Add more finetune scripts for different OS, e.g. Apple Silicon with mlx
- [ ] Make finetune script configurable
- [ ] Provide a playground to instantly test the trained model
- [ ] Containerize backend and frontend

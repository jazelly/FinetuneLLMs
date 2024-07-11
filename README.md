# FinetuneLLMs (Work in Progress, Actively! 🔥)

Finetune an LLM, within a few clicks!

<p align="center">
  <a href="https://discord.gg/kghtMX7v" target="_blank">
    <img src="https://img.shields.io/badge/FinetuneLLMs-chat_with_us-blue" alt="Discord">
  </a>
  <a href="https://github.com/jazelly/FinetuneLLMs/blob/main/LICENSE" target="_blank">
      <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=white" alt="License">
  </a>

</p>

## 🔥Goal & Roadmap🔥

The main objective of this project is to lower the barrier to training large language models, especially for startup companies that have hardware in hands. With this project, it should be easy for a company to start experimenting with LLM training within a basic setup on servers with GPU/CPU resources.

In a way, it helps provide an opportunity for everyone who has hardware available and wants to utilize it in the AI field.

### [Roadmap](https://github.com/users/jazelly/projects/1/views/1)

## General Setup

This repo provides 3 modules, `frontend `(react), `server` (nodejs), and `trainer` (python django)

You need CUDA for now, but once llama.cpp is integrated, this will no longer be required.

- For Linux

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

- For Windows (with Nvidia GPU)

  Enable WSL2 on your machine.

  Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

## Dev Setup

### Setup frontend

```
cd frontend
// copy .env.example to .env
npm ci
npm run dev
// or yarn && yarn dev
```

### Setup server

```
cd server
// copy .env.example to .env and .env.development
npx prisma migrate dev
npm i
npm run dev
```

### Setup trainer

#### Manual installation using Conda

Recommended if you have some experience with the command-line.

##### 0. Install Conda

https://docs.conda.io/en/latest/miniconda.html

On Linux or WSL, it can be automatically installed with these two commands ([source](https://educe-ubc.github.io/conda.html)):

```
curl -sL "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh" > "Miniconda3.sh"
bash Miniconda3.sh
```

##### 1. Create a new conda environment

```
conda create -n fllms python=3.11
conda activate fllms
```

##### 2. Install Pytorch

| System      | GPU      | Command                                                                                                                |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Linux/WSL   | NVIDIA   | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cu121`   |
| Linux/WSL   | CPU only | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cpu`     |
| Linux       | AMD      | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/rocm5.6` |
| MacOS + MPS | Any      | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1`                                                      |
| Windows     | NVIDIA   | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cu121`   |
| Windows     | CPU only | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1`                                                      |

The up-to-date commands can be found here: https://pytorch.org/get-started/locally/.

For NVIDIA, you also need to install the CUDA runtime libraries:

```
conda install -y -c "nvidia/label/cuda-12.1.1" cuda-runtime
```

If you need `nvcc` to compile some library manually, replace the command above with

```
conda install -y -c "nvidia/label/cuda-12.1.1" cuda
```

##### 3. Install dependencies

```
cd trainer
pip install -r requirements.txt
python watch.py
```

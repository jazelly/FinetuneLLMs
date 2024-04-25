# FinetuneLLMs
Collections of all kinds of LLMs finetuning scripts

This repo aims to provide the finest collection of all tuning scripts that can be easily accessed by anyone.

Every training script in this repo is tested across multiple platforms.

## Install dependencies 

### Install pytorch

The easist way to do this is via conda. If you don't have conda, please go to [the installation guide](https://conda.io/projects/conda/en/latest/user-guide/install/index.html)

```
conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia
```

If you don't want to use conda, I recommend virtual env for different LLMs, as they have different requirements

#### For Linux

Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

```
cd llama2
python3 -m venv .llama2
source ./.llama2/bin/activate
pip3 install torch
pip3 install -r requirements.txt
```

#### For Windows

Enable WSL2 on your machine.

Install CUDA inside WSL by following the Linux guide.


#### For Mac

Incoming, with mlx


## Usage

LLM scripts are categorized by their names. Under each, you will see `notebook/`, for `jupyter notebook`, and `script/`, for `python` scripts. They should share same dependencies. 
The training dataset or logic, however, might not be the same, as the purpose of this repo is to share various different examples of finetuning scripts so you can grasp the ideas.


## TODO

- [ ] Try training at GGML and GGUF level
- [ ] Explore OLLAMA
- [ ] Explore mlx examples
- [ ] Explore Finetuning Model in LangChain with OLLAMA
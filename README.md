# FinetuneLLMs (Work in Progress, Actively!)
Collections of all kinds of LLMs finetuning scripts

This repo aims to provide the finest collection of all tuning scripts that can be easily accessed by anyone.

Every training script in this repo is tested across multiple platforms.

## Supported finetuning techniques


| Model \ Method  |  SFT | DPO  | ORPO  | KTO  | PRO  |
|-----------------|------|------|-------|------|------|
| llama 2         | ✅  |  ❌  |  ❌  |  ❌  |  ❌ |
| llama 3         | ✅  |  ❌  |  ✅  |  ❌  |  ❌ |
| gguf            | ✅  |  ❌  |  ❌  |  ❌  |  ❌ |
| phi-3           | ✅  |  ❌  |  ❌  |  ❌  |  ❌ |
| Mistral         | ✅  |  ✅  |  ❌  |  ❌  |  ❌ |

The end goal is any combination of Transformers model and method can be interacted with a few clicks, 
i.e. select model, method, and your dataset, and hit start

## General Setup (deprecating, will provide a UI usage documentation)

- Pull submodules
    ```
    git submodule update --init
    ```

- Install pytorch

    The easist way to do this is via conda. If you don't have conda, please go to [the installation guide](https://conda.io/projects/conda/en/latest/user-guide/install/index.html)

    ```
    conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia
    ```

    If you don't want to use conda, I recommend virtual env for different LLMs, as they have different requirements

- For Linux

    Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)

    ```
    cd llama2
    python3 -m venv .llama2
    source ./.llama2/bin/activate
    pip3 install torch
    pip3 install -r requirements.txt
    ```

- For Windows (with Nvidia GPU)

    Enable WSL2 on your machine.

    Install CUDA from [Nvidia installation guide](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)


- For Mac

    Refer to [mac/README.md](./mac/README.md)

Please note, there might be other dependencies for different model training techniques. Please refer to specific `README` under those model directories.


## TODO

- [x] Support training at GGUF level
- [x] Support `llama.cpp`
- [ ] Expose a finetune script as API and GUI for CUDA (WIP)
- [ ] Add more finetune scripts for different OS
- [ ] Make finetune script configurable
- [ ] Provide a playground to instantly test the trained model
- [ ] Containerize backend and frontend


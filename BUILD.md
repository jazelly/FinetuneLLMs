# Build Guide

There are three components in this project,

- frontend: a react app showing WebUI
- server: a node.js server handling basic CRUD
- trainer: a python [asgi](https://asgi.readthedocs.io/en/latest/) application handling LLM related operations

## Local dev setup

### Setup frontend

```
nvm use
cd frontend
chmod +x init_env.sh
init_env.sh
npm i
npm run dev
```

### Setup server

```
nvm use
cd server
chmod +x init_env.sh
init_env.sh
npm i
npx prisma migrate dev
npm run dev
```

### Setup trainer

#### 0. Install Conda

https://docs.conda.io/en/latest/miniconda.html

On Linux or WSL, it can be automatically installed with these two commands ([source](https://educe-ubc.github.io/conda.html)):

```
curl -sL "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh" > "Miniconda3.sh"
bash Miniconda3.sh
```

#### 1. Create a new conda environment

```
conda create -n fllms python=3.11
conda activate fllms
```

#### 2. Install Pytorch

| System      | GPU      | Command                                                                                                                |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Linux/WSL   | NVIDIA   | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cu121`   |
| Linux/WSL   | CPU only | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cpu`     |
| Linux       | AMD      | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/rocm5.6` |
| MacOS + MPS | Any      | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1`                                                      |
| Windows     | NVIDIA   | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1 --index-url https://download.pytorch.org/whl/cu121`   |
| Windows     | CPU only | `pip3 install torch==2.2.1 torchvision==0.17.1 torchaudio==2.2.1`                                                      |

The up-to-date commands can be found here: https://pytorch.org/get-started/locally/.

#### 3. Install CUDA (optional)

For NVIDIA, you also need to install the CUDA runtime libraries. This is only required if
you want to accelerate training and inference on GPU.

```
conda install -y -c "nvidia/label/cuda-12.1.1" cuda-runtime
```

If you need `nvcc` to compile some library manually, replace the command above with

```
conda install -y -c "nvidia/label/cuda-12.1.1" cuda
```

#### 4. Install python dependencies and run dev mode

```
pip install -r requirements.txt
```

To run in dev mode, i.e. monitoring file changes

```
python watch.py
```

otherwise, to serve on localhost:

```
daphne -b 0.0.0.0 -p 8000 trainer.asgi:application
```

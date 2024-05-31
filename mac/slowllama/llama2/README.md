## Finetune LLAMA 2 with Slowllama

The submodule `slowllama` hardcoded model loader, so we have to get it running 
with your case dynamically by adding a facade `slowllama.py` under this dir. To 
make it work with `slowllama`, make sure you place this finetune directory at the 
same level as `slowllama`, e.g.

```
project
│   llama2-finetune-dir
│   slowllama
```

- Download model from [meta-llama/llama](https://github.com/meta-llama/llama) to 
this dir, and put it like `./llama-2-7b`, at the same level with this README

- Install submodules
    ```
    git submodule init
    git submodule update --init --recursive
    ```

- Update `config.py` to match model path

- Prepare model first
    ```
    python load_model.py
    ```

- Once it's done, you can finetune it by
    ```
    python finetune.py
    ```
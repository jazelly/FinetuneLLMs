## Finetune LLM on MacOS

Currently there are 2 ways supported.

1. in slowllama - under this dir
2. in llama.cpp - refer to [llama-gguf/README.md](../llama-gguf/README.md)

Both only support LLAMA based models.

## Slowllama

Slowllama is a python project purely focusing on finetuning LLAMA model on MacBook. It offloads weights to SSD to support training of large-sized model, i.e. 70B parameters.

Please refer to `./slowllama/` for specific instructions of usage
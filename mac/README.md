## Finetune LLM on MacOS

Currently there are 2 ways supported.

1. in slowllama - under this dir, for LLAMA-2 only
2. in llama.cpp - refer to [llama-gguf/README.md](../llama-gguf/README.md)

## Slowllama

Slowllama is a python project purely focusing on finetuning LLAMA-2 model on MacBook. It offloads weights to SSD to support training of large-sized model, i.e. 70B parameters.

Please refer to `./slowllama/` for specific instructions of usage
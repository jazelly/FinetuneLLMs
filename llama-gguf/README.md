## Finetune LLAMA based model in GGUF format

We will utilize `llama.cpp` to finetune a GGUF model, so that you can customize it and inference it in a programmatic way. `llama.cpp` is a pure C/C++ implementation of LLAMA model with 0 denpendencies, 
So you can run this on any OS.

## Setup

- First, init the submodule if you haven't.
    ```
    git submodule update --init
    cd llama.cpp
    ```

- Using `make`:
  - On Linux or MacOS:

      ```bash
      make
      ```

      **Note**: for `Debug` builds, run `make LLAMA_DEBUG=1`

  - On Windows:

    1. Download the latest fortran version of [w64devkit](https://github.com/skeeto/w64devkit/releases).
    2. Extract `w64devkit` on your pc.
    3. Run `w64devkit.exe`.
    4. Use the `cd` command to reach the `llama.cpp` folder.
    5. From here you can run:
        ```bash
        make
        ```

- Using `CMake`:

    ```bash
    cmake -B build
    cmake --build build --config Release
    ```

    **Note**: for `Debug` builds, there are two cases:

    - Single-config generators (e.g. default = `Unix Makefiles`; note that they just ignore the `--config` flag):

      ```bash
      cmake -B build -DCMAKE_BUILD_TYPE=Debug
      cmake --build build
      ```

    - Multi-config generators (`-G` param set to Visual Studio, XCode...):

      ```bash
      cmake -B build -G "Xcode"
      cmake --build build --config Debug
      ```

- Once the build is done, you can do an example finetuning like this
    ```
    cd build

    # get training data
    wget https://raw.githubusercontent.com/brunoklein99/deep-learning-notes/master/shakespeare.txt

    # download a gguf model
    huggingface-cli login
    huggingface-cli download QuantFactory/Meta-Llama-3-8B-GGUF Meta-Llama-3-8B.Q8_0.gguf --local-dir models

    # start training
    ./bin/finetune --model-base models/Meta-Llama-3-8B.Q8_0.gguf --checkpoint-in chk-lora-open-llama-3b-v2-q8_0-shakespeare-LATEST.gguf         --checkpoint-out chk-lora-open-llama-3b-v2-q8_0-shakespeare-ITERATION.gguf --lora-out lora-open-llama-3b-v2-q8_0-shakespeare-ITERATION.bin         --train-data "shakespeare.txt" --save-every 10  --threads 6 --adam-iter 30 --batch 4 --ctx 6 --use-checkpointing
    ```

- For more help
    ```
    ./bin/finetune --help
    ```
A simple example on using SFTTrainer and Accelerate to finetune Phi-3 models. For 
a more advanced example, please follow HF alignment-handbook/scripts/run_sft.py

1. Install accelerate: 
    conda install -c conda-forge accelerate
2. Setup accelerate config:
    accelerate config to simply use all the GPUs available:
    ```
    python -c "from accelerate.utils import write_basic_config; write_basic_config(mixed_precision='bf16')"
    ```
    check accelerate config:
    `accelerate env`
3. Run the code:
    ```
    accelerate launch script/sft.py
    ```
import os
import torch
from transformers import LogitsProcessorList, InfNanRemoveLogitsProcessor
from transformers.utils import (
    is_torch_cuda_available,
)


def check_bf16_compat(compute_dtype):
    if compute_dtype == torch.float16:
        major, _ = torch.cuda.get_device_capability()
        if major >= 8:
            print("=" * 40)
            print("GPU supports bfloat16")
            print("=" * 40)
            return True

    return False


def calculate_memory_requirements(
    quantization_bit, num_parameters, batch_size, seq_length, hidden_size, num_layers
):
    bits_per_float = quantization_bit
    model_params_memory = num_parameters * bits_per_float // 8
    gradients_memory = num_parameters * bits_per_float // 8
    optimizer_memory = num_parameters * bits_per_float * 2 // 8
    activations_per_layer = batch_size * seq_length * hidden_size
    total_activations = activations_per_layer * num_layers
    activations_memory = total_activations * bits_per_float // 8
    total_memory = (
        model_params_memory + gradients_memory + optimizer_memory + activations_memory
    )
    return {
        "model_params_memory": model_params_memory,
        "gradients_memory": gradients_memory,
        "optimizer_memory": optimizer_memory,
        "activations_memory": activations_memory,
        "total_memory": total_memory,
    }


def get_logits_processor() -> "LogitsProcessorList":
    r"""
    Gets logits processor that removes NaN and Inf logits.
    """
    logits_processor = LogitsProcessorList()
    logits_processor.append(InfNanRemoveLogitsProcessor())
    return logits_processor


def get_current_device() -> "torch.device":
    device = "cpu"
    try:
        if is_torch_cuda_available():
            device = "cuda:{}".format(os.environ.get("LOCAL_RANK", "0"))
    except:
        pass
    return torch.device(device)

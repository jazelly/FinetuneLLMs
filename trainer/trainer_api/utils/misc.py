import os
import torch
from transformers import LogitsProcessorList, InfNanRemoveLogitsProcessor
from transformers.utils import (
    is_torch_cuda_available,
)


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

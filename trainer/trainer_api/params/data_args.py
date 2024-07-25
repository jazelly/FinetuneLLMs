from dataclasses import dataclass, field
from typing import Dict, Literal, Optional, Union

from trainer_api.utils.constants import DATASET_CACHE_DIR


@dataclass
class DataArguments:
    """
    Arguments pertaining to what data we are going to input our model for training and eval.
    """

    template: Optional[str] = field(
        default=None,
        metadata={
            "help": "Which template to use for constructing prompts in training and inference."
        },
    )
    dataset_name: Optional[str] = field(
        default=None,
        metadata={
            "help": "The name of provided dataset(s) to use. Use commas to separate multiple datasets."
        },
    )
    dataset_dir: str = field(
        default=DATASET_CACHE_DIR,
        metadata={"help": "Path to the folder containing the datasets."},
    )
    dataset_config_name: Optional[str] = field(
        default=None,
        metadata={
            "help": "The configuration name of the dataset to use (via the datasets library)."
        },
    )
    dataset_split_name: Optional[str] = field(
        default="train",
        metadata={"help": "The dataset split to use (via the datasets library)."},
    )
    dataset_mixer: Optional[Dict[str, Union[float, Dict[str, object]]]] = field(
        default=None,
        metadata={
            "help": (
                """
                    Datasets and either their proportions to be used for training,
                    or a dict of their proportions and the dataset revision to use.
                    e.g.
                    {
                        'HuggingFaceH4/testing_codealpaca_small': 0.5,
                        'HuggingFaceH4/testing_codealpaca_small': {
                            'fraction': 0.5,
                            'revision': '20-examples'
                        }
                    }

                    As yaml
                    dataset_mixer:
                        HuggingFaceH4/testing_codealpaca_small: 0.5
                        HuggingFaceH4/testing_codealpaca_small:
                            fraction: 0.5
                            revision: 20-examples
                """
            )
        },
    )
    split: str = field(
        default="train",
        metadata={"help": "Which dataset split to use for training and evaluation."},
    )
    cutoff_len: int = field(
        default=1024,
        metadata={"help": "The cutoff length of the tokenized inputs in the dataset."},
    )
    train_on_prompt: bool = field(
        default=False,
        metadata={"help": "Whether to disable the mask on the prompt or not."},
    )
    buffer_size: int = field(
        default=16384,
        metadata={
            "help": "Size of the buffer to randomly sample examples from in dataset streaming."
        },
    )
    mix_strategy: Literal["concat", "interleave_under", "interleave_over"] = field(
        default="concat",
        metadata={
            "help": "Strategy to use in dataset mixing (concat/interleave) (undersampling/oversampling)."
        },
    )
    interleave_probs: Optional[str] = field(
        default=None,
        metadata={
            "help": "Probabilities to sample data from datasets. Use commas to separate multiple datasets."
        },
    )
    overwrite_cache: bool = field(
        default=False,
        metadata={"help": "Overwrite the cached training and evaluation sets."},
    )
    preprocessing_num_workers: Optional[int] = field(
        default=1,
        metadata={"help": "The number of processes to use for the pre-processing."},
    )
    max_samples: Optional[int] = field(
        default=None,
        metadata={
            "help": "For debugging purposes, truncate the number of examples for each dataset."
        },
    )
    eval_num_beams: Optional[int] = field(
        default=None,
        metadata={
            "help": "Number of beams to use for evaluation. This argument will be passed to `model.generate`"
        },
    )
    ignore_pad_token_for_loss: bool = field(
        default=True,
        metadata={
            "help": "Whether or not to ignore the tokens corresponding to the pad label in loss computation."
        },
    )
    val_size: float = field(
        default=0.0,
        metadata={
            "help": "Size of the development set, should be an integer or a float in range `[0,1)`."
        },
    )
    packing: Optional[bool] = field(
        default=None,
        metadata={
            "help": "Enable sequences packing in training. Will automatically enable in pre-training."
        },
    )
    neat_packing: bool = field(
        default=False,
        metadata={"help": "Enable sequence packing without cross-attention."},
    )
    num_beams: Optional[int] = field(
        default=None,
        metadata={
            "help": (
                "Number of beams to use for evaluation. This argument will be passed to ``model.generate``, "
                "which is used during ``evaluate`` and ``predict``."
            )
        },
    )
    tokenized_path: Optional[str] = field(
        default=None,
        metadata={"help": "Path to save or load the tokenized datasets."},
    )

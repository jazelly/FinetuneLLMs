import os
import torch
import logging
from load_model import load_frozen
from config import *
from utils import Tokenizer, greedy_gen

logging.basicConfig(
    format="%(asctime)s %(message)s",
    level=logging.DEBUG,
    filename="logs/finetune.log",
)

def log_lora(lora_layers, log_weights=True, log_grad=True, log_level=logging.INFO):
    if not log_weights and not log_grad:
        return
    try:
        from fewlines import bar
    except ImportError:
        logging.error('Unable to import fewlines. "pip install fewlines" to use distribution logging')
        return
    
    gradients_a = {}
    gradients_b = {}
    weights_a = {}
    weights_b = {}

    for i, lora in enumerate(lora_layers):
        q = lora['q_lora']
        v = lora['v_lora']
        if log_grad:
            gradients_a[f'Q{i}.A'] = q.A.weight.grad.view(-1).to(torch.float32).tolist()
            gradients_b[f'Q{i}.B'] = q.B.weight.grad.view(-1).to(torch.float32).tolist()
            gradients_a[f'V{i}.A'] = v.A.weight.grad.view(-1).to(torch.float32).tolist()
            gradients_b[f'V{i}.B'] = v.B.weight.grad.view(-1).to(torch.float32).tolist()
        if log_weights:
            weights_a[f'Q{i}.A'] = q.A.weight.view(-1).to(torch.float32).tolist()
            weights_b[f'Q{i}.B'] = q.B.weight.view(-1).to(torch.float32).tolist()
            weights_a[f'V{i}.A'] = v.A.weight.view(-1).to(torch.float32).tolist()
            weights_b[f'V{i}.B'] = v.B.weight.view(-1).to(torch.float32).tolist()

    if log_grad:
        logging.log(log_level, f'\n=== GRADIENTS A ===')
        for l in bar.bar_histograms(gradients_a):
            logging.log(log_level, l)

        logging.log(log_level, f'\n=== GRADIENTS B ===')
        for l in bar.bar_histograms(gradients_b):
            logging.log(log_level, l)

    if log_weights:
        logging.log(log_level, f'\n=== WEIGHTS A ===')
        for l in bar.bar_histograms(weights_a):
            logging.log(log_level, l)

        logging.log(log_level, f'\n=== WEIGHTS B ===')
        for l in bar.bar_histograms(weights_b):
            logging.log(log_level, l)

if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s %(message)s', level=log_level, filename='logs/finetune.log')
    torch.random.manual_seed(seed)

    if not os.path.exists(snapshots_path):
        os.makedirs(snapshots_path)

    # data to finetune on
    with open(finetune_file) as f:
        text = f.read()

    tokenizer = Tokenizer(os.path.join(frozen_model_path, 'tokenizer.model'))
    tokens = tokenizer.encode(text, True, True)

    logging.info(f'loaded dataset: {len(tokens)} tokens')

    model = load_frozen(frozen_model_path, compute_dtype=compute_dtype, lora_rank=lora_rank, frozen_dtype=frozen_dtype).to(device).to(compute_dtype)

    def get_batch(batch_size):
        index = torch.randint(len(tokens) - seq_len, (batch_size,))
        x = torch.stack([torch.tensor(tokens[i:i + seq_len]).to(torch.int64) for i in index])
        y = torch.stack([torch.tensor(tokens[i + 1:i + seq_len + 1]).to(torch.int64) for i in index])
        return x.to(device), y.to(device)

    opt = torch.optim.AdamW(model.parameters(), lr=lr, eps=adamw_eps)

    last_loss = None
    for i in range(iters):
        if i % eval_period == 0 and (i > 0 or eval_before_training):
            greedy_gen(model, tokenizer, device, prompt, gen_tokens)
        logging.info(f'starting iteration {i}')
        X, y = get_batch(batch_size)
        opt.zero_grad()
        # both forward and backward passes are here.
        # returned loss is a scalar, not variable
        loss = model.manual_loop(X, y)
        opt.step()

        # optional logging of lora weights/gradients
        log_lora(model.lora_layers, log_weights=log_lora_weight, log_grad=log_lora_grad)

        logging.info(f'backprop done, loss after forward pass = {loss}')
        if last_loss is None:
            last_loss = loss
        elif loss < last_loss:
            last_loss = loss
            logging.info(f'saving snapshot')
            torch.save(model.state_dict(), os.path.join(snapshots_path, f'state_dict_{i}.pth'))

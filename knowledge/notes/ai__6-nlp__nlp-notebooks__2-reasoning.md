```bash
pip install torch transformers datasets
```

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

# Check for GPU
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load a smaller model to reduce GPU usage
model_name = "EleutherAI/gpt-neo-125M"  # Smaller model (125M instead of 1.3B)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Fix: Add padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Set pad_token to eos_token

model = AutoModelForCausalLM.from_pretrained(model_name).to(device)

# Load the GSM8K dataset
dataset = load_dataset("openai/gsm8k", "main")
train_dataset = dataset["train"].shuffle(seed=42).select(range(int(0.9 * len(dataset["train"]))))  # 90% for training
eval_dataset = dataset["train"].shuffle(seed=42).select(range(int(0.9 * len(dataset["train"])), len(dataset["train"])))  # 10% for evaluation

def tokenize_function(example):
    """Tokenize inputs and prepare labels for causal LM training."""
    inputs = tokenizer(example["question"], truncation=True, padding="max_length", max_length=64)  # Reduce max_length
    labels = tokenizer(example["answer"], truncation=True, padding="max_length", max_length=64)["input_ids"]
    return {
        "input_ids": inputs["input_ids"],
        "attention_mask": inputs["attention_mask"],
        "labels": labels,
    }

# Tokenize datasets
train_dataset = train_dataset.map(tokenize_function, batched=True)
eval_dataset = eval_dataset.map(tokenize_function, batched=True)

# Set format for PyTorch
train_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
eval_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# Define training arguments (optimized for low VRAM)
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    per_device_train_batch_size=1,  # Reduce batch size
    per_device_eval_batch_size=1,  # Reduce batch size
    gradient_accumulation_steps=4,  # Simulate larger batches with accumulation
    fp16=True,  # Enable mixed precision training
    save_steps=1000,  # Save model less frequently
    save_total_limit=1,  # Keep only one checkpoint
    num_train_epochs=1,
    logging_dir="./logs",
    logging_steps=50,
)

# Train model
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

trainer.train()

# Save fine-tuned model
model.save_pretrained("./fine_tuned_llm")
tokenizer.save_pretrained("./fine_tuned_llm")
```
```output
tokenizer_config.json:   0%|          | 0.00/727 [00:00<?, ?B/s]
vocab.json:   0%|          | 0.00/899k [00:00<?, ?B/s]
merges.txt:   0%|          | 0.00/456k [00:00<?, ?B/s]
tokenizer.json:   0%|          | 0.00/2.11M [00:00<?, ?B/s]
special_tokens_map.json:   0%|          | 0.00/357 [00:00<?, ?B/s]
config.json:   0%|          | 0.00/1.01k [00:00<?, ?B/s]
model.safetensors:   0%|          | 0.00/526M [00:00<?, ?B/s]
generation_config.json:   0%|          | 0.00/119 [00:00<?, ?B/s]
README.md:   0%|          | 0.00/7.94k [00:00<?, ?B/s]
train-00000-of-00001.parquet:   0%|          | 0.00/2.31M [00:00<?, ?B/s]
… (15 more lines)
 './fine_tuned_llm/merges.txt',
 './fine_tuned_llm/added_tokens.json',
 './fine_tuned_llm/tokenizer.json')
```

| Epoch | Training Loss | Validation Loss |
|---|---|---|
| 0 | 5.181400 | 5.206222 |

7e168d39419c3a9caad4b3ede3d0f64d71502331

```python
import numpy as np

# Function to compute exact match accuracy
def exact_match_accuracy(predictions, ground_truths):
    """
    Computes exact match accuracy.

    Formula:
    Accuracy = (Correct Predictions / Total Questions) * 100
    """
    correct = sum(pred == gt for pred, gt in zip(predictions, ground_truths))
    return (correct / len(ground_truths)) * 100

# Function to compute step-wise accuracy for Chain-of-Thought (CoT) reasoning
def step_wise_accuracy(pred_steps, gt_steps):
    """
    Computes step-wise accuracy.

    Formula:
    Step-wise Accuracy = (Correct Steps / Total Steps) * 100
    """
    correct_steps = sum(p == g for pred, gt in zip(pred_steps, gt_steps) for p, g in zip(pred, gt))
    total_steps = sum(len(gt) for gt in gt_steps)
    return (correct_steps / total_steps) * 100

# Example data
predictions = ["42", "15", "8"]
ground_truths = ["42", "12", "8"]

pred_steps = [["Step 1", "Step 2", "Step 3"], ["Step 1", "Step 2"], ["Step 1"]]
gt_steps = [["Step 1", "Step 2", "Step 3"], ["Step 1", "Wrong Step"], ["Step 1"]]

# Compute metrics
exact_acc = exact_match_accuracy(predictions, ground_truths)
step_acc = step_wise_accuracy(pred_steps, gt_steps)

# Print results
print(f"Exact Match Accuracy: {exact_acc:.2f}%")
print(f"Step-wise Accuracy: {step_acc:.2f}%")
```
```output
Exact Match Accuracy: 66.67%
Step-wise Accuracy: 83.33%
```

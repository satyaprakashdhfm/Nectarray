```python
pip install torch transformers einops numpy sentencepiece datasets mamba-ssm
```

```result
Requirement already satisfied: torch in /usr/local/lib/python3.11/dist-packages (2.5.1+cu124)
Requirement already satisfied: transformers in /usr/local/lib/python3.11/dist-packages (4.48.3)
Requirement already satisfied: einops in /usr/local/lib/python3.11/dist-packages (0.8.1)
Requirement already satisfied: numpy in /usr/local/lib/python3.11/dist-packages (1.26.4)
Requirement already satisfied: sentencepiece in /usr/local/lib/python3.11/dist-packages (0.2.0)
Collecting datasets
  Downloading datasets-3.3.2-py3-none-any.whl.metadata (19 kB)
Collecting mamba-ssm
  Downloading mamba_ssm-2.2.4.tar.gz (91 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 91.8/91.8 kB 8.1 MB/s eta 0:00:00
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from torch) (3.17.0)
Requirement already satisfied: typing-extensions>=4.8.0 in /usr/local/lib/python3.11/dist-packages (from torch) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch) (3.1.5)
Requirement already satisfied: fsspec in /usr/local/lib/python3.11/dist-packages (from torch) (2024.10.0)
Collecting nvidia-cuda-nvrtc-cu12==12.4.127 (from torch)
  Using cached nvidia_cuda_nvrtc_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cuda-runtime-cu12==12.4.127 (from torch)
  Using cached nvidia_cuda_runtime_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cuda-cupti-cu12==12.4.127 (from torch)
  Using cached nvidia_cuda_cupti_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cudnn-cu12==9.1.0.70 (from torch)
  Using cached nvidia_cudnn_cu12-9.1.0.70-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cublas-cu12==12.4.5.8 (from torch)
  Using cached nvidia_cublas_cu12-12.4.5.8-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cufft-cu12==11.2.1.3 (from torch)
  Using cached nvidia_cufft_cu12-11.2.1.3-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-curand-cu12==10.3.5.147 (from torch)
  Using cached nvidia_curand_cu12-10.3.5.147-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cusolver-cu12==11.6.1.9 (from torch)
  Using cached nvidia_cusolver_cu12-11.6.1.9-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cusparse-cu12==12.3.1.170 (from torch)
  Using cached nvidia_cusparse_cu12-12.3.1.170-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Collecting nvidia-nvjitlink-cu12==12.4.127 (from torch)
  Using cached nvidia_nvjitlink_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch) (1.3.0)
Requirement already satisfied: huggingface-hub<1.0,>=0.24.0 in /usr/local/lib/python3.11/dist-packages (from transformers) (0.28.1)
Requirement already satisfied: packaging>=20.0 in /usr/local/lib/python3.11/dist-packages (from transformers) (24.2)
Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.11/dist-packages (from transformers) (6.0.2)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.11/dist-packages (from transformers) (2024.11.6)
Requirement already satisfied: requests in /usr/local/lib/python3.11/dist-packages (from transformers) (2.32.3)
Requirement already satisfied: tokenizers<0.22,>=0.21 in /usr/local/lib/python3.11/dist-packages (from transformers) (0.21.0)
Requirement already satisfied: safetensors>=0.4.1 in /usr/local/lib/python3.11/dist-packages (from transformers) (0.5.2)
Requirement already satisfied: tqdm>=4.27 in /usr/local/lib/python3.11/dist-packages (from transformers) (4.67.1)
Requirement already satisfied: pyarrow>=15.0.0 in /usr/local/lib/python3.11/dist-packages (from datasets) (17.0.0)
Collecting dill<0.3.9,>=0.3.0 (from datasets)
  Downloading dill-0.3.8-py3-none-any.whl.metadata (10 kB)
Requirement already satisfied: pandas in /usr/local/lib/python3.11/dist-packages (from datasets) (2.2.2)
Collecting xxhash (from datasets)
  Downloading xxhash-3.5.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (12 kB)
Collecting multiprocess<0.70.17 (from datasets)
  Downloading multiprocess-0.70.16-py311-none-any.whl.metadata (7.2 kB)
Requirement already satisfied: aiohttp in /usr/local/lib/python3.11/dist-packages (from datasets) (3.11.12)
Collecting ninja (from mamba-ssm)
  Using cached ninja-1.11.1.3-py3-none-manylinux_2_12_x86_64.manylinux2010_x86_64.whl.metadata (5.3 kB)
Requirement already satisfied: setuptools>=61.0.0 in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (75.1.0)
Requirement already satisfied: aiohappyeyeballs>=2.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (2.4.6)
Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.3.2)
Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (25.1.0)
Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.5.0)
Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (6.1.0)
Requirement already satisfied: propcache>=0.2.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (0.2.1)
Requirement already satisfied: yarl<2.0,>=1.17.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.18.3)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (2025.1.31)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch) (3.0.2)
Requirement already satisfied: python-dateutil>=2.8.2 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2.8.2)
Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2025.1)
Requirement already satisfied: tzdata>=2022.7 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2025.1)
Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.11/dist-packages (from python-dateutil>=2.8.2->pandas->datasets) (1.17.0)
Using cached nvidia_cublas_cu12-12.4.5.8-py3-none-manylinux2014_x86_64.whl (363.4 MB)
Using cached nvidia_cuda_cupti_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (13.8 MB)
Using cached nvidia_cuda_nvrtc_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (24.6 MB)
Using cached nvidia_cuda_runtime_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (883 kB)
Using cached nvidia_cudnn_cu12-9.1.0.70-py3-none-manylinux2014_x86_64.whl (664.8 MB)
Using cached nvidia_cufft_cu12-11.2.1.3-py3-none-manylinux2014_x86_64.whl (211.5 MB)
Using cached nvidia_curand_cu12-10.3.5.147-py3-none-manylinux2014_x86_64.whl (56.3 MB)
Using cached nvidia_cusolver_cu12-11.6.1.9-py3-none-manylinux2014_x86_64.whl (127.9 MB)
Using cached nvidia_cusparse_cu12-12.3.1.170-py3-none-manylinux2014_x86_64.whl (207.5 MB)
Using cached nvidia_nvjitlink_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (21.1 MB)
Downloading datasets-3.3.2-py3-none-any.whl (485 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 485.4/485.4 kB 2.9 MB/s eta 0:00:00
Downloading dill-0.3.8-py3-none-any.whl (116 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 116.3/116.3 kB 11.9 MB/s eta 0:00:00
Downloading multiprocess-0.70.16-py311-none-any.whl (143 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 143.5/143.5 kB 14.8 MB/s eta 0:00:00
Using cached ninja-1.11.1.3-py3-none-manylinux_2_12_x86_64.manylinux2010_x86_64.whl (422 kB)
Downloading xxhash-3.5.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (194 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 194.8/194.8 kB 18.0 MB/s eta 0:00:00
Building wheels for collected packages: mamba-ssm
  Building wheel for mamba-ssm (pyproject.toml) ... done
  Created wheel for mamba-ssm: filename=mamba_ssm-2.2.4-cp311-cp311-linux_x86_64.whl size=323672993 sha256=8a0be01153fa30727a9e69024fbe061eb92c7ba4416d2049c5fc3107ed91d852
  Stored in directory: /root/.cache/pip/wheels/2a/5e/64/cfcb5dfe4f854944456e031c34953dc872af1ad7c206145d4a
Successfully built mamba-ssm
Installing collected packages: xxhash, nvidia-nvjitlink-cu12, nvidia-curand-cu12, nvidia-cufft-cu12, nvidia-cuda-runtime-cu12, nvidia-cuda-nvrtc-cu12, nvidia-cuda-cupti-cu12, nvidia-cublas-cu12, ninja, dill, nvidia-cusparse-cu12, nvidia-cudnn-cu12, multiprocess, nvidia-cusolver-cu12, datasets, mamba-ssm
  Attempting uninstall: nvidia-nvjitlink-cu12
    Found existing installation: nvidia-nvjitlink-cu12 12.5.82
    Uninstalling nvidia-nvjitlink-cu12-12.5.82:
      Successfully uninstalled nvidia-nvjitlink-cu12-12.5.82
  Attempting uninstall: nvidia-curand-cu12
    Found existing installation: nvidia-curand-cu12 10.3.6.82
    Uninstalling nvidia-curand-cu12-10.3.6.82:
      Successfully uninstalled nvidia-curand-cu12-10.3.6.82
  Attempting uninstall: nvidia-cufft-cu12
    Found existing installation: nvidia-cufft-cu12 11.2.3.61
    Uninstalling nvidia-cufft-cu12-11.2.3.61:
      Successfully uninstalled nvidia-cufft-cu12-11.2.3.61
  Attempting uninstall: nvidia-cuda-runtime-cu12
    Found existing installation: nvidia-cuda-runtime-cu12 12.5.82
    Uninstalling nvidia-cuda-runtime-cu12-12.5.82:
      Successfully uninstalled nvidia-cuda-runtime-cu12-12.5.82
  Attempting uninstall: nvidia-cuda-nvrtc-cu12
    Found existing installation: nvidia-cuda-nvrtc-cu12 12.5.82
    Uninstalling nvidia-cuda-nvrtc-cu12-12.5.82:
      Successfully uninstalled nvidia-cuda-nvrtc-cu12-12.5.82
  Attempting uninstall: nvidia-cuda-cupti-cu12
    Found existing installation: nvidia-cuda-cupti-cu12 12.5.82
    Uninstalling nvidia-cuda-cupti-cu12-12.5.82:
      Successfully uninstalled nvidia-cuda-cupti-cu12-12.5.82
  Attempting uninstall: nvidia-cublas-cu12
    Found existing installation: nvidia-cublas-cu12 12.5.3.2
    Uninstalling nvidia-cublas-cu12-12.5.3.2:
      Successfully uninstalled nvidia-cublas-cu12-12.5.3.2
  Attempting uninstall: nvidia-cusparse-cu12
    Found existing installation: nvidia-cusparse-cu12 12.5.1.3
    Uninstalling nvidia-cusparse-cu12-12.5.1.3:
      Successfully uninstalled nvidia-cusparse-cu12-12.5.1.3
  Attempting uninstall: nvidia-cudnn-cu12
    Found existing installation: nvidia-cudnn-cu12 9.3.0.75
    Uninstalling nvidia-cudnn-cu12-9.3.0.75:
      Successfully uninstalled nvidia-cudnn-cu12-9.3.0.75
  Attempting uninstall: nvidia-cusolver-cu12
    Found existing installation: nvidia-cusolver-cu12 11.6.3.83
    Uninstalling nvidia-cusolver-cu12-11.6.3.83:
      Successfully uninstalled nvidia-cusolver-cu12-11.6.3.83
Successfully installed datasets-3.3.2 dill-0.3.8 mamba-ssm-2.2.4 multiprocess-0.70.16 ninja-1.11.1.3 nvidia-cublas-cu12-12.4.5.8 nvidia-cuda-cupti-cu12-12.4.127 nvidia-cuda-nvrtc-cu12-12.4.127 nvidia-cuda-runtime-cu12-12.4.127 nvidia-cudnn-cu12-9.1.0.70 nvidia-cufft-cu12-11.2.1.3 nvidia-curand-cu12-10.3.5.147 nvidia-cusolver-cu12-11.6.1.9 nvidia-cusparse-cu12-12.3.1.170 nvidia-nvjitlink-cu12-12.4.127 xxhash-3.5.0
```

```python
pip install --upgrade mamba-ssm
```

```result
Requirement already satisfied: mamba-ssm in /usr/local/lib/python3.11/dist-packages (2.2.4)
Requirement already satisfied: torch in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (2.5.1+cu124)
Requirement already satisfied: ninja in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (1.11.1.3)
Requirement already satisfied: einops in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (0.8.1)
Requirement already satisfied: transformers in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (4.48.3)
Requirement already satisfied: packaging in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (24.2)
Requirement already satisfied: setuptools>=61.0.0 in /usr/local/lib/python3.11/dist-packages (from mamba-ssm) (75.1.0)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (3.17.0)
Requirement already satisfied: typing-extensions>=4.8.0 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (3.1.5)
Requirement already satisfied: fsspec in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (2024.10.0)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch->mamba-ssm) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch->mamba-ssm) (1.3.0)
Requirement already satisfied: huggingface-hub<1.0,>=0.24.0 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (0.28.1)
Requirement already satisfied: numpy>=1.17 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (1.26.4)
Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (6.0.2)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (2024.11.6)
Requirement already satisfied: requests in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (2.32.3)
Requirement already satisfied: tokenizers<0.22,>=0.21 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (0.21.0)
Requirement already satisfied: safetensors>=0.4.1 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (0.5.2)
Requirement already satisfied: tqdm>=4.27 in /usr/local/lib/python3.11/dist-packages (from transformers->mamba-ssm) (4.67.1)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch->mamba-ssm) (3.0.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->transformers->mamba-ssm) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->transformers->mamba-ssm) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->transformers->mamba-ssm) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->transformers->mamba-ssm) (2025.1.31)
```

```python
import torch
from datasets import load_dataset
from transformers import AutoTokenizer

# Load a dataset with long sequences (WikiText-103)
dataset = load_dataset("wikitext", "wikitext-103-v1", split="train")

# Use a tokenizer (GPT-2 tokenizer as an example)
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Tokenize dataset
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=False)

tokenized_dataset = dataset.map(tokenize_function, batched=True)
```

```result
README.md:   0%|          | 0.00/10.5k [00:00<?, ?B/s]
```

```result
test-00000-of-00001.parquet:   0%|          | 0.00/722k [00:00<?, ?B/s]
```

```result
train-00000-of-00002.parquet:   0%|          | 0.00/156M [00:00<?, ?B/s]
```

```result
train-00001-of-00002.parquet:   0%|          | 0.00/156M [00:00<?, ?B/s]
```

```result
validation-00000-of-00001.parquet:   0%|          | 0.00/655k [00:00<?, ?B/s]
```

```result
Generating test split:   0%|          | 0/4358 [00:00<?, ? examples/s]
```

```result
Generating train split:   0%|          | 0/1801350 [00:00<?, ? examples/s]
```

```result
Generating validation split:   0%|          | 0/3760 [00:00<?, ? examples/s]
```

```result
tokenizer_config.json:   0%|          | 0.00/26.0 [00:00<?, ?B/s]
```

```result
config.json:   0%|          | 0.00/665 [00:00<?, ?B/s]
```

```result
vocab.json:   0%|          | 0.00/1.04M [00:00<?, ?B/s]
```

```result
merges.txt:   0%|          | 0.00/456k [00:00<?, ?B/s]
```

```result
tokenizer.json:   0%|          | 0.00/1.36M [00:00<?, ?B/s]
```

```result
Map:   0%|          | 0/1801350 [00:00<?, ? examples/s]
```

```result
Token indices sequence length is longer than the specified maximum sequence length for this model (1059 > 1024). Running this sequence through the model will result in indexing errors
```

```python
import torch.nn as nn
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class VanillaTransformer(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_heads=8, num_layers=6):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.encoder_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=num_heads)
        self.transformer_encoder = nn.TransformerEncoder(self.encoder_layer, num_layers=num_layers)
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.transformer_encoder(x)
        x = self.fc(x)
        return x

# Model setup (move to GPU)
vocab_size = tokenizer.vocab_size
transformer_model = VanillaTransformer(vocab_size).to(device)

# Example forward pass (on GPU)
sample_input = torch.randint(0, vocab_size, (10, 512)).to(device)  # Batch of 10, sequence length 512
output = transformer_model(sample_input)
print(output.shape)  # Should be (10, 512, vocab_size)
```

```result
/usr/local/lib/python3.11/dist-packages/torch/nn/modules/transformer.py:379: UserWarning: enable_nested_tensor is True, but self.use_nested_tensor is False because encoder_layer.self_attn.batch_first was not True(use batch_first for better inference performance)
  warnings.warn(
```

```result
torch.Size([10, 512, 50257])
```

```python
import torch
import torch.nn as nn
from mamba_ssm import Mamba

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class MambaModel(nn.Module):
    def __init__(self, vocab_size, d_model=512):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.mamba = Mamba(d_model=d_model)  # Corrected Mamba usage
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.mamba(x)  # Mamba processing
        x = self.fc(x)
        return x

# Example Usage
vocab_size = 50257  # GPT-2 tokenizer size
mamba_model = MambaModel(vocab_size).to(device)

sample_input = torch.randint(0, vocab_size, (10, 512)).to(device)  # Batch of 10, sequence length 512
output_mamba = mamba_model(sample_input)
print(output_mamba.shape)  # Expected: (10, 512, vocab_size)
```

```result
torch.Size([10, 512, 50257])
```

```python
import time

def benchmark_model(model, input_tensor):
    model.eval()
    start_time = time.time()
    with torch.no_grad():
        _ = model(input_tensor)
    torch.cuda.synchronize()  # Ensure all CUDA operations are finished
    end_time = time.time()
    return end_time - start_time

# Move input tensor to GPU
sample_input = sample_input.to(device)

# Measure inference time
transformer_time = benchmark_model(transformer_model, sample_input)
mamba_time = benchmark_model(mamba_model, sample_input)

print(f"Transformer Inference Time: {transformer_time:.4f}s")
print(f"Mamba Inference Time: {mamba_time:.4f}s")
```

```result
Transformer Inference Time: 0.1863s
Mamba Inference Time: 0.0853s
```

```python
import torch
import time
import torch.nn as nn
from mamba_ssm import Mamba

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define Transformer model
class TransformerModel(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_layers=6):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model, nhead=8), num_layers=num_layers
        )
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.encoder(x)
        return self.fc(x)

# Define Mamba model
class MambaModel(nn.Module):
    def __init__(self, vocab_size, d_model=512):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.mamba = Mamba(d_model=d_model)  # Correct Mamba usage
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.mamba(x)  # Mamba processing
        return self.fc(x)

# Initialize models
vocab_size = 50257
transformer_model = TransformerModel(vocab_size).to(device)
mamba_model = MambaModel(vocab_size).to(device)

# Sequence lengths to test
seq_lengths = [128, 256, 512, 1024, 2048, 4096]

# Function to measure inference time and memory
def benchmark_model(model, seq_len):
    x = torch.randint(0, vocab_size, (1, seq_len)).to(device)
    torch.cuda.synchronize()
    start_time = time.time()
    with torch.no_grad():
        _ = model(x)
    torch.cuda.synchronize()
    return time.time() - start_time

# Run tests
results = []
for seq_len in seq_lengths:
    trans_time = benchmark_model(transformer_model, seq_len)
    mamba_time = benchmark_model(mamba_model, seq_len)
    results.append((seq_len, trans_time, mamba_time))
    print(f"Seq Length {seq_len}: Transformer {trans_time:.4f}s | Mamba {mamba_time:.4f}s")

# Print final results
print("\n=== Final Context Window Performance ===")
print("| Seq Length | Transformer Time (s) | Mamba Time (s) |")
print("|------------|----------------------|----------------|")
for seq_len, trans_time, mamba_time in results:
    print(f"| {seq_len:<10} | {trans_time:<20.4f} | {mamba_time:<14.4f} |")
```

```result
Seq Length 128: Transformer 0.0372s | Mamba 0.0050s
Seq Length 256: Transformer 0.0174s | Mamba 0.0071s
Seq Length 512: Transformer 0.0332s | Mamba 0.0124s
Seq Length 1024: Transformer 0.0558s | Mamba 0.0152s
Seq Length 2048: Transformer 0.0864s | Mamba 0.0278s
Seq Length 4096: Transformer 0.1480s | Mamba 0.0586s

=== Final Context Window Performance ===
| Seq Length | Transformer Time (s) | Mamba Time (s) |
|------------|----------------------|----------------|
| 128        | 0.0372               | 0.0050         |
| 256        | 0.0174               | 0.0071         |
| 512        | 0.0332               | 0.0124         |
| 1024       | 0.0558               | 0.0152         |
| 2048       | 0.0864               | 0.0278         |
| 4096       | 0.1480               | 0.0586         |
```

```python
import torch
import time
import torch.nn as nn
from mamba_ssm import Mamba

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Transformer Model
class TransformerModel(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_layers=6):
        super().__init__()
        self.d_model = d_model  # ✅ Explicitly store d_model
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model, nhead=8), num_layers=num_layers
        )
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.encoder(x)
        return self.fc(x)

# Mamba Model
class MambaModel(nn.Module):
    def __init__(self, vocab_size, d_model=512):
        super().__init__()
        self.d_model = d_model  # ✅ Explicitly store d_model
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.mamba = Mamba(d_model=d_model)
        self.fc = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        x = self.mamba(x)
        return self.fc(x)

# Initialize models
vocab_size = 50257
transformer_model = TransformerModel(vocab_size).to(device)
mamba_model = MambaModel(vocab_size).to(device)

# ✅ Get hidden size (d_model) from embedding layer
def get_d_model(model):
    return model.embedding.embedding_dim  # Uses embedding layer to infer d_model

# Benchmark function
def find_max_context_length(model, model_name, max_memory_gb=1.0):
    seq_len = 128
    max_seq_len = None
    d_model = get_d_model(model)  # ✅ Correctly fetch d_model

    while True:
        try:
            # Generate input tensor
            input_tensor = torch.randint(0, vocab_size, (1, seq_len)).to(device)

            # Measure time & memory
            torch.cuda.synchronize()
            start_time = time.time()
            with torch.no_grad():
                _ = model(input_tensor)
            torch.cuda.synchronize()
            end_time = time.time()

            memory_usage = torch.cuda.memory_allocated(device) / (1024 ** 3)  # GB
            print(f"[{model_name}] Seq Length: {seq_len} | Time: {end_time - start_time:.4f}s | Memory: {memory_usage:.4f} GB")

            if memory_usage > max_memory_gb:
                print(f"🚨 [{model_name}] Max Context Length before 1GB: {max_seq_len} tokens 🚨")
                return max_seq_len

            max_seq_len = seq_len
            seq_len *= 2  # ✅ Double sequence length

        except RuntimeError:
            print(f"❌ [{model_name}] OOM at {seq_len} tokens.")
            return max_seq_len

# Run test with 1GB memory cap
max_len_transformer = find_max_context_length(transformer_model, "Transformer")
max_len_mamba = find_max_context_length(mamba_model, "Mamba")

# Print results
print("\n=== Max Context Length (≤1GB VRAM) ===")
print(f"🚀 Transformer Max: {max_len_transformer} tokens")
print(f"🔥 Mamba Max: {max_len_mamba} tokens")
```

```result
/usr/local/lib/python3.11/dist-packages/torch/nn/modules/transformer.py:379: UserWarning: enable_nested_tensor is True, but self.use_nested_tensor is False because encoder_layer.self_attn.batch_first was not True(use batch_first for better inference performance)
  warnings.warn(
```

```result
[Transformer] Seq Length: 128 | Time: 0.1461s | Memory: 0.4935 GB
[Transformer] Seq Length: 256 | Time: 0.0173s | Memory: 0.5183 GB
[Transformer] Seq Length: 512 | Time: 0.0332s | Memory: 0.5654 GB
[Transformer] Seq Length: 1024 | Time: 0.0643s | Memory: 0.6612 GB
[Transformer] Seq Length: 2048 | Time: 0.1262s | Memory: 0.8529 GB
[Transformer] Seq Length: 4096 | Time: 0.1396s | Memory: 1.2371 GB
🚨 [Transformer] Max Context Length before 1GB: 2048 tokens 🚨
[Mamba] Seq Length: 128 | Time: 0.0604s | Memory: 0.4935 GB
[Mamba] Seq Length: 256 | Time: 0.0044s | Memory: 0.5183 GB
[Mamba] Seq Length: 512 | Time: 0.0054s | Memory: 0.5654 GB
[Mamba] Seq Length: 1024 | Time: 0.0094s | Memory: 0.6612 GB
[Mamba] Seq Length: 2048 | Time: 0.0219s | Memory: 0.8529 GB
[Mamba] Seq Length: 4096 | Time: 0.0576s | Memory: 1.2371 GB
🚨 [Mamba] Max Context Length before 1GB: 2048 tokens 🚨

=== Max Context Length (≤1GB VRAM) ===
🚀 Transformer Max: 2048 tokens
🔥 Mamba Max: 2048 tokens
```

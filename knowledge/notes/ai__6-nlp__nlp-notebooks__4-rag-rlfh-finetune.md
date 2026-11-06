```python
import torch
import gc

# Delete model and optimizer
gc.collect()
torch.cuda.empty_cache()
```

```result title="Error"
---------------------------------------------------------------------------
RuntimeError                              Traceback (most recent call last)
<ipython-input-27-28ab0c8cb1b4> in <cell line: 0>()
      4 # Delete model and optimizer
      5 gc.collect()
----> 6 torch.cuda.empty_cache()

/usr/local/lib/python3.11/dist-packages/torch/cuda/memory.py in empty_cache()
    190     """
    191     if is_initialized():
--> 192         torch._C._cuda_emptyCache()
    193 
    194 

RuntimeError: CUDA error: device-side assert triggered
CUDA kernel errors might be asynchronously reported at some other API call, so the stacktrace below might be incorrect.
For debugging consider passing CUDA_LAUNCH_BLOCKING=1
Compile with `TORCH_USE_CUDA_DSA` to enable device-side assertions.
```

```python
import torch

# Get GPU memory stats
gpu_memory = torch.cuda.memory_allocated() / 1e9  # Convert to GB
gpu_reserved = torch.cuda.memory_reserved() / 1e9
gpu_free = torch.cuda.mem_get_info()[0] / 1e9
gpu_total = torch.cuda.get_device_properties(0).total_memory / 1e9

print(f"🔥 GPU Total Memory: {gpu_total:.2f} GB")
print(f"🟢 GPU Free Memory: {gpu_free:.2f} GB")
print(f"🟡 GPU Allocated Memory: {gpu_memory:.2f} GB")
print(f"🔴 GPU Reserved Memory: {gpu_reserved:.2f} GB")
```

```result
🔥 GPU Total Memory: 15.83 GB
🟢 GPU Free Memory: 7.03 GB
🟡 GPU Allocated Memory: 8.38 GB
🔴 GPU Reserved Memory: 8.66 GB
```

```python
!pip install gdown  # Install gdown if not already installed
!pip install transformers datasets accelerate bitsandbytes
!pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
!pip install sentencepiece
!pip install jsonlines
!pip install huggingface_hub
!pip install flash-attn --no-build-isolation
!pip install trl
!pip install peft
!pip install faiss-cpu sentence-transformers
!pip install ijson
```

```result
Requirement already satisfied: gdown in /usr/local/lib/python3.11/dist-packages (5.2.0)
Requirement already satisfied: beautifulsoup4 in /usr/local/lib/python3.11/dist-packages (from gdown) (4.13.3)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from gdown) (3.17.0)
Requirement already satisfied: requests[socks] in /usr/local/lib/python3.11/dist-packages (from gdown) (2.32.3)
Requirement already satisfied: tqdm in /usr/local/lib/python3.11/dist-packages (from gdown) (4.67.1)
Requirement already satisfied: soupsieve>1.2 in /usr/local/lib/python3.11/dist-packages (from beautifulsoup4->gdown) (2.6)
Requirement already satisfied: typing-extensions>=4.0.0 in /usr/local/lib/python3.11/dist-packages (from beautifulsoup4->gdown) (4.12.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests[socks]->gdown) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests[socks]->gdown) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests[socks]->gdown) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests[socks]->gdown) (2025.1.31)
Requirement already satisfied: PySocks!=1.5.7,>=1.5.6 in /usr/local/lib/python3.11/dist-packages (from requests[socks]->gdown) (1.7.1)
Requirement already satisfied: transformers in /usr/local/lib/python3.11/dist-packages (4.48.3)
Collecting datasets
  Downloading datasets-3.3.2-py3-none-any.whl.metadata (19 kB)
Requirement already satisfied: accelerate in /usr/local/lib/python3.11/dist-packages (1.3.0)
Collecting bitsandbytes
  Downloading bitsandbytes-0.45.3-py3-none-manylinux_2_24_x86_64.whl.metadata (5.0 kB)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from transformers) (3.17.0)
Requirement already satisfied: huggingface-hub<1.0,>=0.24.0 in /usr/local/lib/python3.11/dist-packages (from transformers) (0.28.1)
Requirement already satisfied: numpy>=1.17 in /usr/local/lib/python3.11/dist-packages (from transformers) (1.26.4)
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
Requirement already satisfied: fsspec<=2024.12.0,>=2023.1.0 in /usr/local/lib/python3.11/dist-packages (from fsspec[http]<=2024.12.0,>=2023.1.0->datasets) (2024.10.0)
Requirement already satisfied: aiohttp in /usr/local/lib/python3.11/dist-packages (from datasets) (3.11.12)
Requirement already satisfied: psutil in /usr/local/lib/python3.11/dist-packages (from accelerate) (5.9.5)
Requirement already satisfied: torch>=2.0.0 in /usr/local/lib/python3.11/dist-packages (from accelerate) (2.5.1+cu124)
Requirement already satisfied: aiohappyeyeballs>=2.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (2.4.6)
Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.3.2)
Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (25.1.0)
Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.5.0)
Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (6.1.0)
Requirement already satisfied: propcache>=0.2.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (0.2.1)
Requirement already satisfied: yarl<2.0,>=1.17.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets) (1.18.3)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub<1.0,>=0.24.0->transformers) (4.12.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->transformers) (2025.1.31)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (3.1.5)
Collecting nvidia-cuda-nvrtc-cu12==12.4.127 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cuda_nvrtc_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cuda-runtime-cu12==12.4.127 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cuda_runtime_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cuda-cupti-cu12==12.4.127 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cuda_cupti_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cudnn-cu12==9.1.0.70 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cudnn_cu12-9.1.0.70-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cublas-cu12==12.4.5.8 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cublas_cu12-12.4.5.8-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cufft-cu12==11.2.1.3 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cufft_cu12-11.2.1.3-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-curand-cu12==10.3.5.147 (from torch>=2.0.0->accelerate)
  Downloading nvidia_curand_cu12-10.3.5.147-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting nvidia-cusolver-cu12==11.6.1.9 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cusolver_cu12-11.6.1.9-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Collecting nvidia-cusparse-cu12==12.3.1.170 (from torch>=2.0.0->accelerate)
  Downloading nvidia_cusparse_cu12-12.3.1.170-py3-none-manylinux2014_x86_64.whl.metadata (1.6 kB)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (12.4.127)
Collecting nvidia-nvjitlink-cu12==12.4.127 (from torch>=2.0.0->accelerate)
  Downloading nvidia_nvjitlink_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl.metadata (1.5 kB)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch>=2.0.0->accelerate) (1.3.0)
Requirement already satisfied: python-dateutil>=2.8.2 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2.8.2)
Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2025.1)
Requirement already satisfied: tzdata>=2022.7 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets) (2025.1)
Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.11/dist-packages (from python-dateutil>=2.8.2->pandas->datasets) (1.17.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch>=2.0.0->accelerate) (3.0.2)
Downloading datasets-3.3.2-py3-none-any.whl (485 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 485.4/485.4 kB 28.9 MB/s eta 0:00:00
Downloading bitsandbytes-0.45.3-py3-none-manylinux_2_24_x86_64.whl (76.1 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 76.1/76.1 MB 13.0 MB/s eta 0:00:00
Downloading dill-0.3.8-py3-none-any.whl (116 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 116.3/116.3 kB 11.4 MB/s eta 0:00:00
Downloading multiprocess-0.70.16-py311-none-any.whl (143 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 143.5/143.5 kB 15.2 MB/s eta 0:00:00
Downloading nvidia_cublas_cu12-12.4.5.8-py3-none-manylinux2014_x86_64.whl (363.4 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 363.4/363.4 MB 4.0 MB/s eta 0:00:00
Downloading nvidia_cuda_cupti_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (13.8 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 13.8/13.8 MB 106.2 MB/s eta 0:00:00
Downloading nvidia_cuda_nvrtc_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (24.6 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 24.6/24.6 MB 89.4 MB/s eta 0:00:00
Downloading nvidia_cuda_runtime_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (883 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 883.7/883.7 kB 58.1 MB/s eta 0:00:00
Downloading nvidia_cudnn_cu12-9.1.0.70-py3-none-manylinux2014_x86_64.whl (664.8 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 664.8/664.8 MB 2.1 MB/s eta 0:00:00
Downloading nvidia_cufft_cu12-11.2.1.3-py3-none-manylinux2014_x86_64.whl (211.5 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 211.5/211.5 MB 5.5 MB/s eta 0:00:00
Downloading nvidia_curand_cu12-10.3.5.147-py3-none-manylinux2014_x86_64.whl (56.3 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 56.3/56.3 MB 12.1 MB/s eta 0:00:00
Downloading nvidia_cusolver_cu12-11.6.1.9-py3-none-manylinux2014_x86_64.whl (127.9 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 127.9/127.9 MB 6.4 MB/s eta 0:00:00
Downloading nvidia_cusparse_cu12-12.3.1.170-py3-none-manylinux2014_x86_64.whl (207.5 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 207.5/207.5 MB 5.6 MB/s eta 0:00:00
Downloading nvidia_nvjitlink_cu12-12.4.127-py3-none-manylinux2014_x86_64.whl (21.1 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 21.1/21.1 MB 85.3 MB/s eta 0:00:00
Downloading xxhash-3.5.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (194 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 194.8/194.8 kB 18.3 MB/s eta 0:00:00
Installing collected packages: xxhash, nvidia-nvjitlink-cu12, nvidia-curand-cu12, nvidia-cufft-cu12, nvidia-cuda-runtime-cu12, nvidia-cuda-nvrtc-cu12, nvidia-cuda-cupti-cu12, nvidia-cublas-cu12, dill, nvidia-cusparse-cu12, nvidia-cudnn-cu12, multiprocess, nvidia-cusolver-cu12, datasets, bitsandbytes
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
Successfully installed bitsandbytes-0.45.3 datasets-3.3.2 dill-0.3.8 multiprocess-0.70.16 nvidia-cublas-cu12-12.4.5.8 nvidia-cuda-cupti-cu12-12.4.127 nvidia-cuda-nvrtc-cu12-12.4.127 nvidia-cuda-runtime-cu12-12.4.127 nvidia-cudnn-cu12-9.1.0.70 nvidia-cufft-cu12-11.2.1.3 nvidia-curand-cu12-10.3.5.147 nvidia-cusolver-cu12-11.6.1.9 nvidia-cusparse-cu12-12.3.1.170 nvidia-nvjitlink-cu12-12.4.127 xxhash-3.5.0
Looking in indexes: https://download.pytorch.org/whl/cpu
Requirement already satisfied: torch in /usr/local/lib/python3.11/dist-packages (2.5.1+cu124)
Requirement already satisfied: torchvision in /usr/local/lib/python3.11/dist-packages (0.20.1+cu124)
Requirement already satisfied: torchaudio in /usr/local/lib/python3.11/dist-packages (2.5.1+cu124)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from torch) (3.17.0)
Requirement already satisfied: typing-extensions>=4.8.0 in /usr/local/lib/python3.11/dist-packages (from torch) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch) (3.1.5)
Requirement already satisfied: fsspec in /usr/local/lib/python3.11/dist-packages (from torch) (2024.10.0)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch) (1.3.0)
Requirement already satisfied: numpy in /usr/local/lib/python3.11/dist-packages (from torchvision) (1.26.4)
Requirement already satisfied: pillow!=8.3.*,>=5.3.0 in /usr/local/lib/python3.11/dist-packages (from torchvision) (11.1.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch) (3.0.2)
Requirement already satisfied: sentencepiece in /usr/local/lib/python3.11/dist-packages (0.2.0)
Collecting jsonlines
  Downloading jsonlines-4.0.0-py3-none-any.whl.metadata (1.6 kB)
Requirement already satisfied: attrs>=19.2.0 in /usr/local/lib/python3.11/dist-packages (from jsonlines) (25.1.0)
Downloading jsonlines-4.0.0-py3-none-any.whl (8.7 kB)
Installing collected packages: jsonlines
Successfully installed jsonlines-4.0.0
Requirement already satisfied: huggingface_hub in /usr/local/lib/python3.11/dist-packages (0.28.1)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (3.17.0)
Requirement already satisfied: fsspec>=2023.5.0 in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (2024.10.0)
Requirement already satisfied: packaging>=20.9 in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (24.2)
Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (6.0.2)
Requirement already satisfied: requests in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (2.32.3)
Requirement already satisfied: tqdm>=4.42.1 in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (4.67.1)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface_hub) (4.12.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface_hub) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface_hub) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface_hub) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface_hub) (2025.1.31)
Collecting flash-attn
  Downloading flash_attn-2.7.4.post1.tar.gz (6.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 6.0/6.0 MB 88.7 MB/s eta 0:00:00
  Preparing metadata (setup.py) ... done
Requirement already satisfied: torch in /usr/local/lib/python3.11/dist-packages (from flash-attn) (2.5.1+cu124)
Requirement already satisfied: einops in /usr/local/lib/python3.11/dist-packages (from flash-attn) (0.8.1)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (3.17.0)
Requirement already satisfied: typing-extensions>=4.8.0 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (3.1.5)
Requirement already satisfied: fsspec in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (2024.10.0)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch->flash-attn) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch->flash-attn) (1.3.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch->flash-attn) (3.0.2)
Building wheels for collected packages: flash-attn
  Building wheel for flash-attn (setup.py) ... done
  Created wheel for flash-attn: filename=flash_attn-2.7.4.post1-cp311-cp311-linux_x86_64.whl size=187815463 sha256=d944fc7d2f962bce83fc4708c2fc0c21eaf8255962a0b350ae919362a51b7ef2
  Stored in directory: /root/.cache/pip/wheels/3d/88/d8/284b89f56af7d5bf366b10d6b8e251ac8a7c7bf3f04203fb4f
Successfully built flash-attn
Installing collected packages: flash-attn
Successfully installed flash-attn-2.7.4.post1
Collecting trl
  Downloading trl-0.15.1-py3-none-any.whl.metadata (11 kB)
Requirement already satisfied: accelerate>=0.34.0 in /usr/local/lib/python3.11/dist-packages (from trl) (1.3.0)
Requirement already satisfied: datasets>=2.21.0 in /usr/local/lib/python3.11/dist-packages (from trl) (3.3.2)
Requirement already satisfied: rich in /usr/local/lib/python3.11/dist-packages (from trl) (13.9.4)
Requirement already satisfied: transformers>=4.46.0 in /usr/local/lib/python3.11/dist-packages (from trl) (4.48.3)
Requirement already satisfied: numpy<3.0.0,>=1.17 in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (1.26.4)
Requirement already satisfied: packaging>=20.0 in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (24.2)
Requirement already satisfied: psutil in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (5.9.5)
Requirement already satisfied: pyyaml in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (6.0.2)
Requirement already satisfied: torch>=2.0.0 in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (2.5.1+cu124)
Requirement already satisfied: huggingface-hub>=0.21.0 in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (0.28.1)
Requirement already satisfied: safetensors>=0.4.3 in /usr/local/lib/python3.11/dist-packages (from accelerate>=0.34.0->trl) (0.5.2)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (3.17.0)
Requirement already satisfied: pyarrow>=15.0.0 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (17.0.0)
Requirement already satisfied: dill<0.3.9,>=0.3.0 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (0.3.8)
Requirement already satisfied: pandas in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (2.2.2)
Requirement already satisfied: requests>=2.32.2 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (2.32.3)
Requirement already satisfied: tqdm>=4.66.3 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (4.67.1)
Requirement already satisfied: xxhash in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (3.5.0)
Requirement already satisfied: multiprocess<0.70.17 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (0.70.16)
Requirement already satisfied: fsspec<=2024.12.0,>=2023.1.0 in /usr/local/lib/python3.11/dist-packages (from fsspec[http]<=2024.12.0,>=2023.1.0->datasets>=2.21.0->trl) (2024.10.0)
Requirement already satisfied: aiohttp in /usr/local/lib/python3.11/dist-packages (from datasets>=2.21.0->trl) (3.11.12)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.11/dist-packages (from transformers>=4.46.0->trl) (2024.11.6)
Requirement already satisfied: tokenizers<0.22,>=0.21 in /usr/local/lib/python3.11/dist-packages (from transformers>=4.46.0->trl) (0.21.0)
Requirement already satisfied: markdown-it-py>=2.2.0 in /usr/local/lib/python3.11/dist-packages (from rich->trl) (3.0.0)
Requirement already satisfied: pygments<3.0.0,>=2.13.0 in /usr/local/lib/python3.11/dist-packages (from rich->trl) (2.18.0)
Requirement already satisfied: aiohappyeyeballs>=2.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (2.4.6)
Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (1.3.2)
Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (25.1.0)
Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (1.5.0)
Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (6.1.0)
Requirement already satisfied: propcache>=0.2.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (0.2.1)
Requirement already satisfied: yarl<2.0,>=1.17.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.21.0->trl) (1.18.3)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.21.0->accelerate>=0.34.0->trl) (4.12.2)
Requirement already satisfied: mdurl~=0.1 in /usr/local/lib/python3.11/dist-packages (from markdown-it-py>=2.2.0->rich->trl) (0.1.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests>=2.32.2->datasets>=2.21.0->trl) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests>=2.32.2->datasets>=2.21.0->trl) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests>=2.32.2->datasets>=2.21.0->trl) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests>=2.32.2->datasets>=2.21.0->trl) (2025.1.31)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (3.1.5)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch>=2.0.0->accelerate>=0.34.0->trl) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch>=2.0.0->accelerate>=0.34.0->trl) (1.3.0)
Requirement already satisfied: python-dateutil>=2.8.2 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets>=2.21.0->trl) (2.8.2)
Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets>=2.21.0->trl) (2025.1)
Requirement already satisfied: tzdata>=2022.7 in /usr/local/lib/python3.11/dist-packages (from pandas->datasets>=2.21.0->trl) (2025.1)
Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.11/dist-packages (from python-dateutil>=2.8.2->pandas->datasets>=2.21.0->trl) (1.17.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch>=2.0.0->accelerate>=0.34.0->trl) (3.0.2)
Downloading trl-0.15.1-py3-none-any.whl (318 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 318.9/318.9 kB 13.8 MB/s eta 0:00:00
Installing collected packages: trl
Successfully installed trl-0.15.1
Requirement already satisfied: peft in /usr/local/lib/python3.11/dist-packages (0.14.0)
Requirement already satisfied: numpy>=1.17 in /usr/local/lib/python3.11/dist-packages (from peft) (1.26.4)
Requirement already satisfied: packaging>=20.0 in /usr/local/lib/python3.11/dist-packages (from peft) (24.2)
Requirement already satisfied: psutil in /usr/local/lib/python3.11/dist-packages (from peft) (5.9.5)
Requirement already satisfied: pyyaml in /usr/local/lib/python3.11/dist-packages (from peft) (6.0.2)
Requirement already satisfied: torch>=1.13.0 in /usr/local/lib/python3.11/dist-packages (from peft) (2.5.1+cu124)
Requirement already satisfied: transformers in /usr/local/lib/python3.11/dist-packages (from peft) (4.48.3)
Requirement already satisfied: tqdm in /usr/local/lib/python3.11/dist-packages (from peft) (4.67.1)
Requirement already satisfied: accelerate>=0.21.0 in /usr/local/lib/python3.11/dist-packages (from peft) (1.3.0)
Requirement already satisfied: safetensors in /usr/local/lib/python3.11/dist-packages (from peft) (0.5.2)
Requirement already satisfied: huggingface-hub>=0.25.0 in /usr/local/lib/python3.11/dist-packages (from peft) (0.28.1)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.25.0->peft) (3.17.0)
Requirement already satisfied: fsspec>=2023.5.0 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.25.0->peft) (2024.10.0)
Requirement already satisfied: requests in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.25.0->peft) (2.32.3)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.25.0->peft) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (3.1.5)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch>=1.13.0->peft) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch>=1.13.0->peft) (1.3.0)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.11/dist-packages (from transformers->peft) (2024.11.6)
Requirement already satisfied: tokenizers<0.22,>=0.21 in /usr/local/lib/python3.11/dist-packages (from transformers->peft) (0.21.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch>=1.13.0->peft) (3.0.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.25.0->peft) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.25.0->peft) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.25.0->peft) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.25.0->peft) (2025.1.31)
Collecting faiss-cpu
  Downloading faiss_cpu-1.10.0-cp311-cp311-manylinux_2_28_x86_64.whl.metadata (4.4 kB)
Requirement already satisfied: sentence-transformers in /usr/local/lib/python3.11/dist-packages (3.4.1)
Requirement already satisfied: numpy<3.0,>=1.25.0 in /usr/local/lib/python3.11/dist-packages (from faiss-cpu) (1.26.4)
Requirement already satisfied: packaging in /usr/local/lib/python3.11/dist-packages (from faiss-cpu) (24.2)
Requirement already satisfied: transformers<5.0.0,>=4.41.0 in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (4.48.3)
Requirement already satisfied: tqdm in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (4.67.1)
Requirement already satisfied: torch>=1.11.0 in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (2.5.1+cu124)
Requirement already satisfied: scikit-learn in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (1.6.1)
Requirement already satisfied: scipy in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (1.13.1)
Requirement already satisfied: huggingface-hub>=0.20.0 in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (0.28.1)
Requirement already satisfied: Pillow in /usr/local/lib/python3.11/dist-packages (from sentence-transformers) (11.1.0)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.20.0->sentence-transformers) (3.17.0)
Requirement already satisfied: fsspec>=2023.5.0 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.20.0->sentence-transformers) (2024.10.0)
Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.20.0->sentence-transformers) (6.0.2)
Requirement already satisfied: requests in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.20.0->sentence-transformers) (2.32.3)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.20.0->sentence-transformers) (4.12.2)
Requirement already satisfied: networkx in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (3.4.2)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (3.1.5)
Requirement already satisfied: nvidia-cuda-nvrtc-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.127)
Requirement already satisfied: nvidia-cuda-runtime-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.127)
Requirement already satisfied: nvidia-cuda-cupti-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.127)
Requirement already satisfied: nvidia-cudnn-cu12==9.1.0.70 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (9.1.0.70)
Requirement already satisfied: nvidia-cublas-cu12==12.4.5.8 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.5.8)
Requirement already satisfied: nvidia-cufft-cu12==11.2.1.3 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (11.2.1.3)
Requirement already satisfied: nvidia-curand-cu12==10.3.5.147 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (10.3.5.147)
Requirement already satisfied: nvidia-cusolver-cu12==11.6.1.9 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (11.6.1.9)
Requirement already satisfied: nvidia-cusparse-cu12==12.3.1.170 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.3.1.170)
Requirement already satisfied: nvidia-nccl-cu12==2.21.5 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (2.21.5)
Requirement already satisfied: nvidia-nvtx-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.127)
Requirement already satisfied: nvidia-nvjitlink-cu12==12.4.127 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (12.4.127)
Requirement already satisfied: triton==3.1.0 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (3.1.0)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.11/dist-packages (from torch>=1.11.0->sentence-transformers) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.11/dist-packages (from sympy==1.13.1->torch>=1.11.0->sentence-transformers) (1.3.0)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.11/dist-packages (from transformers<5.0.0,>=4.41.0->sentence-transformers) (2024.11.6)
Requirement already satisfied: tokenizers<0.22,>=0.21 in /usr/local/lib/python3.11/dist-packages (from transformers<5.0.0,>=4.41.0->sentence-transformers) (0.21.0)
Requirement already satisfied: safetensors>=0.4.1 in /usr/local/lib/python3.11/dist-packages (from transformers<5.0.0,>=4.41.0->sentence-transformers) (0.5.2)
Requirement already satisfied: joblib>=1.2.0 in /usr/local/lib/python3.11/dist-packages (from scikit-learn->sentence-transformers) (1.4.2)
Requirement already satisfied: threadpoolctl>=3.1.0 in /usr/local/lib/python3.11/dist-packages (from scikit-learn->sentence-transformers) (3.5.0)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.11/dist-packages (from jinja2->torch>=1.11.0->sentence-transformers) (3.0.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.20.0->sentence-transformers) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.20.0->sentence-transformers) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.20.0->sentence-transformers) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests->huggingface-hub>=0.20.0->sentence-transformers) (2025.1.31)
Downloading faiss_cpu-1.10.0-cp311-cp311-manylinux_2_28_x86_64.whl (30.7 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 30.7/30.7 MB 15.7 MB/s eta 0:00:00
Installing collected packages: faiss-cpu
Successfully installed faiss-cpu-1.10.0
Collecting ijson
  Downloading ijson-3.3.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (21 kB)
Downloading ijson-3.3.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (119 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 119.2/119.2 kB 12.0 MB/s eta 0:00:00
Installing collected packages: ijson
Successfully installed ijson-3.3.0
```

```python
!gdown "https://drive.google.com/uc?id=1WrSQRdNh8AwmwDBtySzEBVyh43ITcEFM" -O data.csv
```

```result
Downloading...
From (original): https://drive.google.com/uc?id=1WrSQRdNh8AwmwDBtySzEBVyh43ITcEFM
From (redirected): https://drive.google.com/uc?id=1WrSQRdNh8AwmwDBtySzEBVyh43ITcEFM&confirm=t&uuid=479a2fcc-c381-4045-aa25-2bd72cd82207
To: /content/data.csv
100% 2.29G/2.29G [00:40<00:00, 56.0MB/s]
```

```python
import pandas as pd
df=pd.read_csv(r"/content/data.csv")
```

```python
# Drop 'Unnamed: 0', 'NER', and 'source' columns
df = df.drop(columns=['Unnamed: 0', 'NER', 'source'])

# Rename 'link' column to 'source'
df = df.rename(columns={'link': 'source'})

# Display the modified DataFrame
df.head()
```

<div class="kb-html">
  <div id="df-222deaf0-09c2-4e28-b3a4-69da74dc47f5" class="colab-df-container">
    <div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>ingredients</th>
      <th>directions</th>
      <th>source</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>No-Bake Nut Cookies</td>
      <td>["1 c. firmly packed brown sugar", "1/2 c. eva...</td>
      <td>["In a heavy 2-quart saucepan, mix brown sugar...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=44874</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Jewell Ball'S Chicken</td>
      <td>["1 small jar chipped beef, cut up", "4 boned ...</td>
      <td>["Place chipped beef on bottom of baking dish....</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=699419</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Creamy Corn</td>
      <td>["2 (16 oz.) pkg. frozen corn", "1 (8 oz.) pkg...</td>
      <td>["In a slow cooker, combine all ingredients. C...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=10570</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Chicken Funny</td>
      <td>["1 large whole chicken", "2 (10 1/2 oz.) cans...</td>
      <td>["Boil and debone chicken.", "Put bite size pi...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=897570</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Reeses Cups(Candy)</td>
      <td>["1 c. peanut butter", "3/4 c. graham cracker ...</td>
      <td>["Combine first four ingredients and press in ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=659239</td>
    </tr>
  </tbody>
</table>
</div>
    <div class="colab-df-buttons">
  <div class="colab-df-container">
    <button class="colab-df-convert" onclick="convertToInteractive('df-222deaf0-09c2-4e28-b3a4-69da74dc47f5')"
            title="Convert this dataframe to an interactive table."
            style="display:none;">
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
    <path d="M120-120v-720h720v720H120Zm60-500h600v-160H180v160Zm220 220h160v-160H400v160Zm0 220h160v-160H400v160ZM180-400h160v-160H180v160Zm440 0h160v-160H620v160ZM180-180h160v-160H180v160Zm440 0h160v-160H620v160Z"/>
  </svg>
    </button>
  </div>
<div id="df-b61e808f-2959-4bb6-b171-cccccfeee0c2">
  <button class="colab-df-quickchart" onclick="quickchart('df-b61e808f-2959-4bb6-b171-cccccfeee0c2')"
            title="Suggest charts"
            style="display:none;">
<svg xmlns="http://www.w3.org/2000/svg" height="24px"viewBox="0 0 24 24"
     width="24px">
    <g>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </g>
</svg>
  </button>
</div>
    </div>
  </div>
</div>

```python
df.to_csv("cleaned_recipe_data.csv", index=False)
```

```python
import pandas as pd
import json

def generate_qa_dataset(df):
    """Creates a Q&A formatted dataset from the cleaned data"""
    qa_data = []

    for _, row in df.iterrows():
        for col in df.columns:
            if col != "title":  # Exclude title from Q&A
                question = f"What is the {col} for {row.get('title', 'this recipe')}?"

                value = row[col]
                if isinstance(value, str) and value.startswith("[") and value.endswith("]"):
                    # Convert string representation of list to an actual list
                    try:
                        value = json.loads(value)
                    except json.JSONDecodeError:
                        pass  # If it's not a valid list, leave it as is

                if isinstance(value, list):
                    answer = ", ".join(value)  # Convert list to a proper string
                else:
                    answer = str(value)  # Convert non-list values to string

                qa_data.append({"question": question, "answer": answer})

    return qa_data

# Load dataset
df = pd.read_csv("cleaned_recipe_data.csv")

# Generate Q&A dataset
qa_dataset = generate_qa_dataset(df)

# Save to JSON file
with open("qa_dataset.json", "w", encoding="utf-8") as f:
    json.dump(qa_dataset, f, indent=4, ensure_ascii=False)

print("Q&A dataset saved as qa_dataset.json")
```

```result
Q&A dataset saved as qa_dataset.json
```

```python
import ijson
import json
sample_file = "qa_dataset.json"

# Stream through the JSON without loading it all into memory
with open(sample_file, "r", encoding="utf-8") as f:
    parser = ijson.items(f, "item")  # 'item' refers to elements in the outermost array
    for i, entry in enumerate(parser):
        if i == 3:  # Only show first 3 entries to avoid memory overload
            break
        print(f"🔹 Entry {i+1}:\n{json.dumps(entry, indent=4, ensure_ascii=False)}\n")
```

```result
🔹 Entry 1:
{
    "question": "What is the ingredients for No-Bake Nut Cookies?",
    "answer": "1 c. firmly packed brown sugar, 1/2 c. evaporated milk, 1/2 tsp. vanilla, 1/2 c. broken nuts (pecans), 2 Tbsp. butter or margarine, 3 1/2 c. bite size shredded rice biscuits"
}

🔹 Entry 2:
{
    "question": "What is the directions for No-Bake Nut Cookies?",
    "answer": "In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine., Stir over medium heat until mixture bubbles all over top., Boil and stir 5 minutes more. Take off heat., Stir in vanilla and cereal; mix well., Using 2 teaspoons, drop and shape into 30 clusters on wax paper., Let stand until firm, about 30 minutes."
}

🔹 Entry 3:
{
    "question": "What is the source for No-Bake Nut Cookies?",
    "answer": "www.cookbooks.com/Recipe-Details.aspx?id=44874"
}
```

---

```python
from huggingface_hub import login

login()
```

```result
VBox(children=(HTML(value='<center> <img\nsrc=https://huggingface.co/front/assets/huggingface_logo-noborder.sv…
```

```python
#REDACTED_HF_TOKEN
```

```python
from huggingface_hub import HfApi

api = HfApi()

try:
    user_info = api.whoami()
    print(user_info)  # Should print your Hugging Face account details
except Exception as e:
    print("❌ Authentication failed:", e)
```

```result
/usr/local/lib/python3.11/dist-packages/huggingface_hub/utils/_auth.py:94: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
```

```result
{'type': 'user', 'id': '63514be9a8822aadf57354dc', 'name': 'satya3485', 'fullname': 'satyaprakashreddy', 'canPay': False, 'periodEnd': None, 'isPro': False, 'avatarUrl': '/avatars/65663c5eb3568865c2eb262e2dc70da8.svg', 'orgs': [], 'auth': {'type': 'access_token', 'accessToken': {'displayName': 'fuckyou', 'role': 'fineGrained', 'createdAt': '2025-02-23T04:22:06.996Z', 'fineGrained': {'canReadGatedRepos': True, 'global': ['inference.serverless.write', 'discussion.write', 'post.write'], 'scoped': [{'entity': {'_id': '65143cd8e31c0e2e3df713e5', 'type': 'model', 'name': 'mistralai/Mistral-7B-Instruct-v0.1'}, 'permissions': ['repo.content.read', 'discussion.write', 'repo.write']}, {'entity': {'_id': '63514be9a8822aadf57354dc', 'type': 'user', 'name': 'satya3485'}, 'permissions': ['repo.content.read', 'repo.write', 'inference.endpoints.infer.write', 'inference.endpoints.write', 'user.webhooks.read', 'user.webhooks.write', 'collection.read', 'collection.write', 'discussion.write', 'user.billing.read']}]}}}}
```

```python
#7e168d39419c3a9caad4b3ede3d0f64d71502331
```

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model
from datasets import load_dataset
from trl import SFTTrainer

# Model name
model_name = "mistralai/Mistral-7B-Instruct-v0.1"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load model with 4-bit quantization (fits in 20GB RAM)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    load_in_4bit=True,
    torch_dtype=torch.float16
)

# LoRA config for efficient fine-tuning
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"]  # Fine-tuning key attention layers
)

# Apply LoRA
model = get_peft_model(model, lora_config)

print("✅ Mistral-7B loaded with LoRA fine-tuning enabled.")
```

```result
/usr/local/lib/python3.11/dist-packages/huggingface_hub/utils/_auth.py:94: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
```

```result
tokenizer_config.json:   0%|          | 0.00/2.10k [00:00<?, ?B/s]
```

```result
tokenizer.model:   0%|          | 0.00/493k [00:00<?, ?B/s]
```

```result
tokenizer.json:   0%|          | 0.00/1.80M [00:00<?, ?B/s]
```

```result
special_tokens_map.json:   0%|          | 0.00/414 [00:00<?, ?B/s]
```

```result
config.json:   0%|          | 0.00/571 [00:00<?, ?B/s]
```

```result
The `load_in_4bit` and `load_in_8bit` arguments are deprecated and will be removed in the future versions. Please, pass a `BitsAndBytesConfig` object in `quantization_config` argument instead.
```

```result
model.safetensors.index.json:   0%|          | 0.00/25.1k [00:00<?, ?B/s]
```

```result
Downloading shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
model-00001-of-00002.safetensors:   0%|          | 0.00/9.94G [00:00<?, ?B/s]
```

```result
model-00002-of-00002.safetensors:   0%|          | 0.00/4.54G [00:00<?, ?B/s]
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
generation_config.json:   0%|          | 0.00/116 [00:00<?, ?B/s]
```

```result
✅ Mistral-7B loaded with LoRA fine-tuning enabled.
```

```python
import torch
import ijson
from datasets import Dataset
from transformers import TrainingArguments
from trl import SFTTrainer

# Load only a small portion of the dataset efficiently
sample_size = 1000  # Number of samples to load
sample_file = "qa_dataset.json"

data = []
with open(sample_file, "r", encoding="utf-8") as f:
    parser = ijson.items(f, "item")  # Stream JSON objects
    for i, item in enumerate(parser):
        if i >= sample_size:
            break
        data.append({"text": f"### Question: {item['question']}\n### Answer: {item['answer']}"})

# Create a Hugging Face dataset
dataset = Dataset.from_list(data)
dataset = dataset.train_test_split(test_size=0.2)

# Ensure dataset is not empty
if len(dataset["train"]) == 0 or len(dataset["test"]) == 0:
    raise ValueError("Dataset is empty after filtering. Increase sample size!")

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",  # Required for saving checkpoints/logs
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=2,
    fp16=True,
    save_steps=5000,
    eval_strategy="steps",
    eval_steps=5000,
    logging_steps=1000,
    learning_rate=5e-5,
    num_train_epochs=2,
    save_total_limit=1,
)

# Initialize trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    args=training_args,
    processing_class=None,  # Fixing deprecated tokenizer issue
)

# Start training
trainer.train()

print("✅ Fine-tuning completed successfully!")
```

```result
Converting train dataset to ChatML:   0%|          | 0/800 [00:00<?, ? examples/s]
```

```result
Applying chat template to train dataset:   0%|          | 0/800 [00:00<?, ? examples/s]
```

```result
Tokenizing train dataset:   0%|          | 0/800 [00:00<?, ? examples/s]
```

```result
Tokenizing train dataset:   0%|          | 0/800 [00:00<?, ? examples/s]
```

```result
Converting eval dataset to ChatML:   0%|          | 0/200 [00:00<?, ? examples/s]
```

```result
Applying chat template to eval dataset:   0%|          | 0/200 [00:00<?, ? examples/s]
```

```result
Tokenizing eval dataset:   0%|          | 0/200 [00:00<?, ? examples/s]
```

```result
Tokenizing eval dataset:   0%|          | 0/200 [00:00<?, ? examples/s]
```

```result
wandb: WARNING The `run_name` is currently set to the same value as `TrainingArguments.output_dir`. If this was not intended, please specify a different run name by setting the `TrainingArguments.run_name` parameter.
```

```result
<IPython.core.display.Javascript object>
```

```result
wandb: Logging into wandb.ai. (Learn how to deploy a W&B server locally: https://wandb.me/wandb-server)
wandb: You can find your API key in your browser here: https://wandb.ai/authorize
wandb: Paste an API key from your profile and hit enter:
```

```result
 ··········
```

```result
wandb: WARNING If you're specifying your api key in code, ensure this code is not shared publicly.
wandb: WARNING Consider setting the WANDB_API_KEY environment variable, or running `wandb login` from the command line.
wandb: Appending key for api.wandb.ai to your netrc file: /root/.netrc
wandb: Currently logged in as: sp7386101 (sp7386101-srm-institute-of-science-and-technology) to https://api.wandb.ai. Use `wandb login --relogin` to force relogin
wandb: Using wandb-core as the SDK backend.  Please refer to https://wandb.me/wandb-core for more information.
```

<div class="kb-html">
Tracking run with wandb version 0.19.6
</div>

<div class="kb-html">
Run data is saved locally in <code>/content/wandb/run-20250225_124605-tjsmhl7j</code>
</div>

<div class="kb-html">
Syncing run <strong><a href='https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface/runs/tjsmhl7j' target="_blank">./results</a></strong> to <a href='https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface' target="_blank">Weights & Biases</a> (<a href='https://wandb.me/developer-guide' target="_blank">docs</a>)<br>
</div>

<div class="kb-html">
 View project at <a href='https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface' target="_blank">https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface</a>
</div>

<div class="kb-html">
 View run at <a href='https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface/runs/tjsmhl7j' target="_blank">https://wandb.ai/sp7386101-srm-institute-of-science-and-technology/huggingface/runs/tjsmhl7j</a>
</div>

```result
/usr/local/lib/python3.11/dist-packages/bitsandbytes/nn/modules.py:451: UserWarning: Input type into Linear4bit is torch.float16, but bnb_4bit_compute_dtype=torch.float32 (default). This will lead to slow inference or training speed.
  warnings.warn(
```

<div class="kb-html">
    <div>
      <progress value='400' max='400' style='width:300px; height:20px; vertical-align: middle;'></progress>
      [400/400 13:12, Epoch 2/2]
    </div>
    <table border="1" class="dataframe">
  <thead>
 <tr style="text-align: left;">
      <th>Step</th>
      <th>Training Loss</th>
      <th>Validation Loss</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table><p>
</div>

```result
✅ Fine-tuning completed successfully!
```

```python
#7e168d39419c3a9caad4b3ede3d0f64d71502331
```

```python
save_path = "./mistral_lora_finetuned_duplicate"

# Save model with LoRA weights
model.save_pretrained(save_path)

# Save tokenizer
tokenizer.save_pretrained(save_path)

print(f"✅ Model saved at {save_path}")
```

```result
✅ Model saved at ./mistral_lora_finetuned_duplicate
```

```python
import torch

# Get GPU memory stats
gpu_memory = torch.cuda.memory_allocated() / 1e9  # Convert to GB
gpu_reserved = torch.cuda.memory_reserved() / 1e9
gpu_free = torch.cuda.mem_get_info()[0] / 1e9
gpu_total = torch.cuda.get_device_properties(0).total_memory / 1e9

print(f"🔥 GPU Total Memory: {gpu_total:.2f} GB")
print(f"🟢 GPU Free Memory: {gpu_free:.2f} GB")
print(f"🟡 GPU Allocated Memory: {gpu_memory:.2f} GB")
print(f"🔴 GPU Reserved Memory: {gpu_reserved:.2f} GB")
```

```result
🔥 GPU Total Memory: 15.83 GB
🟢 GPU Free Memory: 7.50 GB
🟡 GPU Allocated Memory: 4.54 GB
🔴 GPU Reserved Memory: 8.19 GB
```

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

# Initialize model and tokenizer
save_path = "./mistral_lora_finetuned_duplicate"
base_model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
tokenizer = AutoTokenizer.from_pretrained(save_path)
model_end = PeftModel.from_pretrained(base_model, save_path)

# Use half precision for reduced memory usage
model_end = model_end.half()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_end.to(device)
model_end.eval()

# Clear GPU memory before inference
torch.cuda.empty_cache()

# Function to generate recipe from the model
def generate_recipe(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    with torch.no_grad():
        output = model_end.generate(**inputs, max_new_tokens=50)  # Reduced token length
    return tokenizer.decode(output[0], skip_special_tokens=True)

# Single prompt for generating a recipe
prompt = "What are the ingredients needed for Jewell Ball'S Chicken?"

# Generate the recipe for the prompt
generated_text = generate_recipe(prompt)

# Display the prompt and the generated recipe
print(f"Prompt: {prompt}")
print("\nGenerated Recipe:\n")
print(generated_text)
```

```result
/usr/local/lib/python3.11/dist-packages/huggingface_hub/utils/_auth.py:94: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```python
# Single prompt for generating a recipe
prompt = "What is the source of Scalloped Corn?"

# Generate the recipe for the prompt
generated_text = generate_recipe(prompt)

# Display the prompt and the generated recipe
print(f"Prompt: {prompt}")
print("\nGenerated Recipe:\n")
print(generated_text)
```

```result
Setting `pad_token_id` to `eos_token_id`:2 for open-end generation.
```

```result
Prompt: What is the source of Scalloped Corn?

Generated Recipe:

What is the source of Scalloped Corn?
### Ingredients
- 1 cup cornmeal
- 1 cup milk
- 1 cup grated cheese
- 1 cup corn
- 1/2 cup butter
- 1/2 cup flour
```

```python
import torch
import numpy as np
from tqdm import tqdm
import random
import json

# Load dataset from JSON
with open("qa_recipe_data.json", "r") as f:
    data = json.load(f)

# Extract test data correctly
test_data_list = data["test"] if "test" in data else data

# Ensure it's a list
if isinstance(test_data_list, dict):
    test_data_list = list(test_data_list.values())

# Select 30 random samples
eval_samples = random.sample(test_data_list, min(30, len(test_data_list)))

# Function to evaluate model
def evaluate_model(model_end, dataset, tokenizer):
    model_end.eval()
    losses = []

    for example in tqdm(dataset, desc="Evaluating"):
        inputs = tokenizer(example["question"], return_tensors="pt", truncation=True, padding=True).to(device)

        with torch.no_grad():
            outputs = model_end(**inputs, labels=inputs["input_ids"])
            loss = outputs.loss
            losses.append(loss.item())

    avg_loss = np.mean(losses)
    perplexity = np.exp(avg_loss)

    return avg_loss, perplexity

# Run evaluation on 30 samples
avg_loss, ppl = evaluate_model(model_end, eval_samples, tokenizer)

print(f"Validation Loss: {avg_loss:.4f}")
print(f"Perplexity (PPL): {ppl:.4f}")
```

```result
Evaluating:   0%|          | 0/30 [00:00<?, ?it/s]Asking to truncate to max_length but no maximum length is provided and the model has no predefined maximum length. Default to no truncation.
Evaluating: 100%|██████████| 30/30 [00:02<00:00, 13.37it/s]
```

```result
Validation Loss: 3.0446
Perplexity (PPL): 21.0008
```

```python
df.head(30)
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>ingredients</th>
      <th>directions</th>
      <th>source</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>No-Bake Nut Cookies</td>
      <td>['1 c. firmly packed brown sugar', '1/2 c. eva...</td>
      <td>['In a heavy 2-quart saucepan, mix brown sugar...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=44874</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Jewell Ball'S Chicken</td>
      <td>['1 small jar chipped beef, cut up', '4 boned ...</td>
      <td>['Place chipped beef on bottom of baking dish....</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=699419</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Creamy Corn</td>
      <td>['2 (16 oz.) pkg. frozen corn', '1 (8 oz.) pkg...</td>
      <td>['In a slow cooker, combine all ingredients. C...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=10570</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Chicken Funny</td>
      <td>['1 large whole chicken', '2 (10 1/2 oz.) cans...</td>
      <td>['Boil and debone chicken.', 'Put bite size pi...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=897570</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Reeses Cups(Candy)</td>
      <td>['1 c. peanut butter', '3/4 c. graham cracker ...</td>
      <td>['Combine first four ingredients and press in ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=659239</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Cheeseburger Potato Soup</td>
      <td>['6 baking potatoes', '1 lb. of extra lean gro...</td>
      <td>['Wash potatoes; prick several times with a fo...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=20115</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Rhubarb Coffee Cake</td>
      <td>['1 1/2 c. sugar', '1/2 c. butter', '1 egg', '...</td>
      <td>['Cream sugar and butter.', 'Add egg and beat ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=210288</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Scalloped Corn</td>
      <td>['1 can cream-style corn', '1 can whole kernel...</td>
      <td>['Mix together both cans of corn, crackers, eg...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=876969</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Nolan'S Pepper Steak</td>
      <td>['1 1/2 lb. round steak (1-inch thick), cut in...</td>
      <td>['Roll steak strips in flour.', 'Brown in skil...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=375254</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Millionaire Pie</td>
      <td>['1 large container Cool Whip', '1 large can c...</td>
      <td>['Empty Cool Whip into a bowl.', 'Drain juice ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=794547</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Double Cherry Delight</td>
      <td>['1 (17 oz.) can dark sweet pitted cherries', ...</td>
      <td>['Drain cherries, measuring syrup.', 'Cut cher...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=703381</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Buckeye Candy</td>
      <td>['1 box powdered sugar', '8 oz. soft butter', ...</td>
      <td>['Mix sugar, butter and peanut butter.', 'Roll...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=886785</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Quick Barbecue Wings</td>
      <td>['chicken wings (as many as you need for dinne...</td>
      <td>['Clean wings.', 'Flour and fry until done.', ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=768311</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Taco Salad Chip Dip</td>
      <td>['8 oz. Ortega taco sauce', '8 oz. sour cream'...</td>
      <td>['Mix taco sauce, sour cream and cream cheese....</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=806409</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Pink Stuff(Frozen Dessert)</td>
      <td>['1 can pie filling (cherry or strawberry)', '...</td>
      <td>['Mix all ingredients together.', 'Pour into a...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=982483</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Fresh Strawberry Pie</td>
      <td>['1 baked pie shell', '1 qt. cleaned strawberr...</td>
      <td>['Mix water, cornstarch, sugar and salt in sau...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=161321</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Easy German Chocolate Cake</td>
      <td>['1/2 pkg. chocolate fudge cake mix without pu...</td>
      <td>['Mix according to directions and add oil.', '...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=983179</td>
    </tr>
    <tr>
      <th>17</th>
      <td>Broccoli Salad</td>
      <td>['1 large head broccoli (about 1 1/2 lb.)', '1...</td>
      <td>['Trim off large leaves of broccoli and remove...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=50992</td>
    </tr>
    <tr>
      <th>18</th>
      <td>Strawberry Whatever</td>
      <td>['1 lb. frozen strawberries in juice', '1 smal...</td>
      <td>['Mix Jell-O in boiling water.', 'Add strawber...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=718063</td>
    </tr>
    <tr>
      <th>19</th>
      <td>Eggless Milkless Applesauce Cake</td>
      <td>['3/4 c. sugar', '1/2 c. shortening', '1 1/2 c...</td>
      <td>['Mix Crisco with applesauce, nuts and raisins...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=343158</td>
    </tr>
    <tr>
      <th>20</th>
      <td>Grandma Hanrath'S Banana Breadfort Collins, Co...</td>
      <td>['1 c. sugar', '1/2 c. shortening', '2 eggs (a...</td>
      <td>['Cream sugar and shortening.', 'Add eggs, sal...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=1072247</td>
    </tr>
    <tr>
      <th>21</th>
      <td>Chocolate Frango Mints</td>
      <td>["1 pkg. devil's food cake mix", '1 pkg. choco...</td>
      <td>['Mix ingredients together for 5 minutes.', 'S...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=958474</td>
    </tr>
    <tr>
      <th>22</th>
      <td>Cuddy Farms Marinated Turkey</td>
      <td>['2 c. 7-Up or Sprite', '1 c. vegetable oil', ...</td>
      <td>['Buy whole turkey breast; remove all skin and...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=9449</td>
    </tr>
    <tr>
      <th>23</th>
      <td>Spaghetti Sauce To Can</td>
      <td>['1/2 bushel tomatoes', '1 c. oil', '1/4 c. mi...</td>
      <td>['Cook ground or chopped peppers and onions in...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=1059279</td>
    </tr>
    <tr>
      <th>24</th>
      <td>Prize-Winning Meat Loaf</td>
      <td>['1 1/2 lb. ground beef', '1 c. tomato juice',...</td>
      <td>['Mix well.', 'Press firmly into an 8 1/2 x 4 ...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=923674</td>
    </tr>
    <tr>
      <th>25</th>
      <td>Smothered Round Steak(Servings: 4)</td>
      <td>['2 lb. round steak', '1/2 tsp. ground black p...</td>
      <td>['Alex Patout says, "Smothering is a multipurp...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=982859</td>
    </tr>
    <tr>
      <th>26</th>
      <td>Corral Barbecued Beef Steak Strips</td>
      <td>['2 lb. round steak 1/2 to 3/4-inch thick, sli...</td>
      <td>['Brown strips in cooking oil.', 'Pour off dri...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=420402</td>
    </tr>
    <tr>
      <th>27</th>
      <td>Easy Fudge</td>
      <td>['1 (14 oz.) can sweetened condensed milk', '1...</td>
      <td>['Butter a square pan, 8 x 8 x 2-inches.', 'He...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=812407</td>
    </tr>
    <tr>
      <th>28</th>
      <td>Taco-Filled Green Pepper</td>
      <td>['1 lb. Ground Beef', '1 pkg. taco seasoning',...</td>
      <td>['In a large skillet, brown the ground beef. D...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=39004</td>
    </tr>
    <tr>
      <th>29</th>
      <td>One Hour Rolls</td>
      <td>['1 c. milk', '2 Tbsp. sugar', '1 pkg. dry yea...</td>
      <td>['Put flour into a large mixing bowl.', 'Combi...</td>
      <td>www.cookbooks.com/Recipe-Details.aspx?id=294341</td>
    </tr>
  </tbody>
</table>
</div>
</div>

---

```python
import gc
import os
import psutil

def free_memory():
    """Clears RAM and CPU resources."""

    # Garbage collection
    gc.collect()

    # Attempt to clear some OS level caches. This is OS dependent and not guaranteed
    try:
        os.system('sync')  # Linux/macOS: Flush file system buffers
        if os.name == 'posix': #Linux/macOS
            os.system('sudo sysctl vm.drop_caches=3') #clear pagecache, dentries and inodes. requires sudo.
        elif os.name == 'nt': #Windows
            pass #Windows does not have easy command line cache clearing.
    except Exception as e:
        print(f"Cache clearing attempt failed: {e}")

    # Optionally, you can try to release some memory by swapping. However, this is generally handled by the OS.
    # On linux you can use swapoff -a and swapon -a. But this is very disruptive.
    # On windows, swap is managed automatically.

    print(f"Memory Usage before freeing: {psutil.virtual_memory().percent}%")

    # Force garbage collection again, just in case.
    gc.collect()

    print(f"Memory Usage after freeing: {psutil.virtual_memory().percent}%")
```

```python
import torch
import faiss
import numpy as np
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# Define paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"
lora_model_path = "./mistral_lora_finetuned_duplicate"

# Load base model in 4-bit mode
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,  # Use 4-bit precision to save memory
    bnb_4bit_compute_dtype=torch.float16,  # Use float16 for computation
    bnb_4bit_use_double_quant=True,  # Enable double quantization
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"  # Automatically assigns layers to available GPUs
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Load LoRA adapters
model_end = PeftModel.from_pretrained(base_model, lora_model_path)

# Move to GPU and set to evaluation mode
model_end.eval()

# Clear GPU cache
torch.cuda.empty_cache()

print("✅ Model loaded with 4-bit quantization to reduce memory usage.")
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Model loaded with 4-bit quantization to reduce memory usage.
```

```python
!pip install ijson
```

```result
Requirement already satisfied: ijson in /usr/local/lib/python3.11/dist-packages (3.3.0)
```

```python
import ijson
import json

# Define file paths
original_file = "qa_dataset.json"
rag_file = "rag_dataset.json"
max_records = 1000
rag_data = []

# Open and stream the JSON array using ijson
with open(original_file, "r", encoding="utf-8") as f:
    # 'item' tells ijson to iterate over each element in the top-level array
    parser = ijson.items(f, "item")
    for i, entry in enumerate(parser):
        if i >= max_records:
            break  # Stop after processing 1000 records

        # Check that the entry is a dict with required keys
        if isinstance(entry, dict) and "question" in entry and "answer" in entry:
            question = entry["question"]
            answer = entry["answer"]

            # If answer is a list, join it into a single string
            if isinstance(answer, list):
                answer = " ".join(answer)

            rag_data.append({"question": question, "answer": answer})
        else:
            print(f"⚠️ Skipping entry {i+1} due to missing keys or unexpected format.")

# Save the new RAG dataset to file
with open(rag_file, "w", encoding="utf-8") as f:
    json.dump(rag_data, f, indent=4, ensure_ascii=False)

print(f"✅ Successfully saved {len(rag_data)} entries in {rag_file}.")
```

```result
✅ Successfully saved 1000 entries in rag_dataset.json.
```

```python
import json

# Define file path
rag_file = "rag_dataset.json"

# Load and display a few entries
with open(rag_file, "r", encoding="utf-8") as f:
    try:
        rag_data = json.load(f)  # Load JSON
        print(f"✅ Loaded {len(rag_data)} entries from {rag_file}.")

        # Print first 5 entries for verification
        for i, entry in enumerate(rag_data[:5]):
            print(f"\n🔹 Entry {i+1}:")
            print(json.dumps(entry, indent=4, ensure_ascii=False))

    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
```

```result
✅ Loaded 1000 entries from rag_dataset.json.

🔹 Entry 1:
{
    "question": "What is the ingredients for No-Bake Nut Cookies?",
    "answer": "1 c. firmly packed brown sugar, 1/2 c. evaporated milk, 1/2 tsp. vanilla, 1/2 c. broken nuts (pecans), 2 Tbsp. butter or margarine, 3 1/2 c. bite size shredded rice biscuits"
}

🔹 Entry 2:
{
    "question": "What is the directions for No-Bake Nut Cookies?",
    "answer": "In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine., Stir over medium heat until mixture bubbles all over top., Boil and stir 5 minutes more. Take off heat., Stir in vanilla and cereal; mix well., Using 2 teaspoons, drop and shape into 30 clusters on wax paper., Let stand until firm, about 30 minutes."
}

🔹 Entry 3:
{
    "question": "What is the source for No-Bake Nut Cookies?",
    "answer": "www.cookbooks.com/Recipe-Details.aspx?id=44874"
}

🔹 Entry 4:
{
    "question": "What is the ingredients for Jewell Ball'S Chicken?",
    "answer": "1 small jar chipped beef, cut up, 4 boned chicken breasts, 1 can cream of mushroom soup, 1 carton sour cream"
}

🔹 Entry 5:
{
    "question": "What is the directions for Jewell Ball'S Chicken?",
    "answer": "Place chipped beef on bottom of baking dish., Place chicken on top of beef., Mix soup and cream together; pour over chicken. Bake, uncovered, at 275° for 3 hours."
}
```

```python
import json
import faiss
import numpy as np
import torch
from sentence_transformers import SentenceTransformer

# Load dataset
dataset_path = "rag_dataset.json"
with open(dataset_path, "r") as f:
    rag_data_subset = json.load(f)

# Extract questions and answers
rag_questions = [entry["question"] for entry in rag_data_subset]
rag_answers = [entry["answer"] for entry in rag_data_subset]  # ✅ Extract answers

# Validate data
if len(rag_questions) != len(rag_answers):
    raise ValueError("❌ Mismatch between questions and answers!")

print(f"📜 Extracted {len(rag_questions)} questions and {len(rag_answers)} answers.")
print(f"First 5 answers: {rag_answers[:5]}")

# Initialize embedding model
device = "cuda" if torch.cuda.is_available() else "cpu"
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", device=device)

# Convert questions to embeddings
rag_embeddings = embedding_model.encode(rag_questions, convert_to_numpy=True)
print(f"📏 Embedding matrix shape: {rag_embeddings.shape}")

# Initialize FAISS index
dimension = rag_embeddings.shape[1]
rag_index = faiss.IndexFlatL2(dimension)
rag_index.add(rag_embeddings)

print(f"🎯 FAISS index created with {len(rag_answers)} entries!")

# Retrieval function
def retrieve_documents(query, top_k=3):
    """Retrieve the most relevant answers based on the query."""
    query_embedding = embedding_model.encode([query], convert_to_numpy=True)
    distances, indices = rag_index.search(query_embedding, top_k)

    retrieved_docs = []
    for i, idx in enumerate(indices[0]):
        if idx < len(rag_answers):
            retrieved_docs.append(rag_answers[idx])
        else:
            print(f"⚠️ Warning: Invalid index {idx}")

    return retrieved_docs

# Example query
prompt = "What are the ingredients for No-Bake Nut Cookies?"
retrieved_docs = retrieve_documents(prompt, top_k=3)

print(f"🔍 Query: {prompt}\n")
print("📄 Retrieved Documents:\n")
for idx, doc in enumerate(retrieved_docs, 1):
    print(f"{idx}. {doc}\n")
```

```result
📜 Extracted 1000 questions and 1000 answers.
First 5 answers: ['1 c. firmly packed brown sugar, 1/2 c. evaporated milk, 1/2 tsp. vanilla, 1/2 c. broken nuts (pecans), 2 Tbsp. butter or margarine, 3 1/2 c. bite size shredded rice biscuits', 'In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine., Stir over medium heat until mixture bubbles all over top., Boil and stir 5 minutes more. Take off heat., Stir in vanilla and cereal; mix well., Using 2 teaspoons, drop and shape into 30 clusters on wax paper., Let stand until firm, about 30 minutes.', 'www.cookbooks.com/Recipe-Details.aspx?id=44874', '1 small jar chipped beef, cut up, 4 boned chicken breasts, 1 can cream of mushroom soup, 1 carton sour cream', 'Place chipped beef on bottom of baking dish., Place chicken on top of beef., Mix soup and cream together; pour over chicken. Bake, uncovered, at 275° for 3 hours.']
📏 Embedding matrix shape: (1000, 384)
🎯 FAISS index created with 1000 entries!
🔍 Query: What are the ingredients for No-Bake Nut Cookies?

📄 Retrieved Documents:

1. 1 c. firmly packed brown sugar, 1/2 c. evaporated milk, 1/2 tsp. vanilla, 1/2 c. broken nuts (pecans), 2 Tbsp. butter or margarine, 3 1/2 c. bite size shredded rice biscuits

2. www.cookbooks.com/Recipe-Details.aspx?id=44874

3. 1/2 c. butter or margarine, 1/2 c. peanut butter, 1/2 c. brown sugar, 1/2 c. white sugar, 1 egg, 1/2 tsp. vanilla, 1 1/4 c. sifted flour, 3/4 tsp. baking soda, 1/2 tsp. salt, 1 (10 oz.) bag miniature Reese's peanut butter cups
```

```python
import torch
import faiss
import numpy as np
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"
lora_model_path = "./mistral_lora_finetuned_duplicate"

# Load base model with 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Load LoRA fine-tuned adapters
model = PeftModel.from_pretrained(base_model, lora_model_path)

# Move to evaluation mode
model.eval()
torch.cuda.empty_cache()

print("✅ Fine-Tuned Mistral Loaded!")

# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

# Load fine-tuned or pretrained SentenceTransformer model
embedding_model_path = "all-MiniLM-L6-v2"  # Change if you have a fine-tuned model
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

print("✅ Pretrained SentenceTransformer Loaded!")

# ========================== STEP 3: Load FAISS Index ========================== #

# Define FAISS index path
faiss_index_path = "faiss_index.bin"

# Load FAISS index
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]

# ========================== STEP 4: RAG Retrieval Function ========================== #

def retrieve_relevant_docs(query, top_k=3):
    """Retrieve top-k relevant documents from FAISS index based on query."""
    query_embedding = embedding_model.encode([query], convert_to_numpy=True)
    distances, indices = faiss_index.search(query_embedding, top_k)

    retrieved_docs = []
    for idx, score in zip(indices[0], distances[0]):
        if idx < len(documents):
            retrieved_docs.append((documents[idx], score))

    return retrieved_docs

# ========================== STEP 5: Generate Response with Mistral ========================== #
# Ensure the tokenizer has a padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Set EOS token as padding
    if tokenizer.pad_token is None:  # If EOS token is also missing
        tokenizer.add_special_tokens({'pad_token': '[PAD]'})
        model.resize_token_embeddings(len(tokenizer))  # Adjust model embeddings

def generate_response(query):
    """Retrieve relevant documents and generate a structured response using Mistral."""
    retrieved_docs = retrieve_relevant_docs(query)

    context_text = "\n".join([doc[0] for doc in retrieved_docs if doc[1] > 0.1])

    prompt = f"Answer the query using the retrieved context:\n\n{context_text}\n\nQuery: {query}\nAnswer:"

    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512).to("cuda")

    output = model.generate(
        **inputs,
        max_length=256,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.pad_token_id
    )

    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response



# ========================== TEST EXAMPLE ========================== #

query = "What are the ingredients for No-Bake Nut Cookies?"
response = generate_response(query)

print("\n🔍 Query:", query)
print("📄 Retrieved Context:")
for doc, score in retrieve_relevant_docs(query):
    print(f"- {doc} (Score: {score:.4f})")

print("\n🤖 Mistral's Response:", response)
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
✅ Pretrained SentenceTransformer Loaded!
✅ FAISS index loaded successfully!

🔍 Query: What are the ingredients for No-Bake Nut Cookies?
📄 Retrieved Context:
- What is the ingredients for No-Bake Nut Cookies? (Score: 0.0044)
- What is the source for No-Bake Nut Cookies? (Score: 0.2998)
- What is the ingredients for Peanut Butter Cup Cookies? (Score: 0.4072)

🤖 Mistral's Response: Answer the query using the retrieved context:

What is the source for No-Bake Nut Cookies?
What is the ingredients for Peanut Butter Cup Cookies?

Query: What are the ingredients for No-Bake Nut Cookies?
Answer: 1 c. sugar, 1/2 c. margarine, 1/2 c. peanut butter, 1/4 c. cream, 1/2 c. flour, 1 pkg. chocolate chips, 1/2 c. chopped nuts and 10 graham crackers crushed., Mix together first 3 ingredients in saucepan over medium heat., Melt margarine and peanut butter., Add all ingredients., Spoon out on cookie sheet., Chill 20 min. in refrigerator.
```

```python
import faiss
import numpy as np
import json
import torch
from sentence_transformers import SentenceTransformer

# Define paths
dataset_path = "rag_dataset.json"  # Your dataset file
faiss_index_path = "faiss_index.bin"  # Where to save the FAISS index
embedding_model_path = "all-MiniLM-L6-v2"  # Change to your fine-tuned model if available

# Load sentence transformer model
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

# Load dataset
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)

# Extract questions (or relevant text for indexing)
documents = [entry["question"] for entry in rag_data]  # Adjust if needed

# Convert text into embeddings
document_embeddings = embedding_model.encode(documents, convert_to_numpy=True, show_progress_bar=True)

# Create FAISS index
embedding_dim = document_embeddings.shape[1]  # Get embedding size (e.g., 384)
faiss_index = faiss.IndexFlatL2(embedding_dim)  # L2 distance index
faiss_index.add(document_embeddings)  # Add embeddings to FAISS index

# Save FAISS index
faiss.write_index(faiss_index, faiss_index_path)
print(f"✅ FAISS index saved to {faiss_index_path}")
```

```result
Batches:   0%|          | 0/32 [00:00<?, ?it/s]
```

```result
✅ FAISS index saved to faiss_index.bin
```

```python
faiss_index = faiss.read_index("faiss_index.bin")
print("✅ FAISS index loaded successfully!")
```

```result
✅ FAISS index loaded successfully!
```

```python
!pip install evaluate
```

```result
Collecting evaluate
  Downloading evaluate-0.4.3-py3-none-any.whl.metadata (9.2 kB)
Requirement already satisfied: datasets>=2.0.0 in /usr/local/lib/python3.11/dist-packages (from evaluate) (3.3.2)
Requirement already satisfied: numpy>=1.17 in /usr/local/lib/python3.11/dist-packages (from evaluate) (1.26.4)
Requirement already satisfied: dill in /usr/local/lib/python3.11/dist-packages (from evaluate) (0.3.8)
Requirement already satisfied: pandas in /usr/local/lib/python3.11/dist-packages (from evaluate) (2.2.2)
Requirement already satisfied: requests>=2.19.0 in /usr/local/lib/python3.11/dist-packages (from evaluate) (2.32.3)
Requirement already satisfied: tqdm>=4.62.1 in /usr/local/lib/python3.11/dist-packages (from evaluate) (4.67.1)
Requirement already satisfied: xxhash in /usr/local/lib/python3.11/dist-packages (from evaluate) (3.5.0)
Requirement already satisfied: multiprocess in /usr/local/lib/python3.11/dist-packages (from evaluate) (0.70.16)
Requirement already satisfied: fsspec>=2021.05.0 in /usr/local/lib/python3.11/dist-packages (from fsspec[http]>=2021.05.0->evaluate) (2024.10.0)
Requirement already satisfied: huggingface-hub>=0.7.0 in /usr/local/lib/python3.11/dist-packages (from evaluate) (0.28.1)
Requirement already satisfied: packaging in /usr/local/lib/python3.11/dist-packages (from evaluate) (24.2)
Requirement already satisfied: filelock in /usr/local/lib/python3.11/dist-packages (from datasets>=2.0.0->evaluate) (3.17.0)
Requirement already satisfied: pyarrow>=15.0.0 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.0.0->evaluate) (17.0.0)
Requirement already satisfied: aiohttp in /usr/local/lib/python3.11/dist-packages (from datasets>=2.0.0->evaluate) (3.11.12)
Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.11/dist-packages (from datasets>=2.0.0->evaluate) (6.0.2)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.11/dist-packages (from huggingface-hub>=0.7.0->evaluate) (4.12.2)
Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.11/dist-packages (from requests>=2.19.0->evaluate) (3.4.1)
Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.11/dist-packages (from requests>=2.19.0->evaluate) (3.10)
Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.11/dist-packages (from requests>=2.19.0->evaluate) (2.3.0)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.11/dist-packages (from requests>=2.19.0->evaluate) (2025.1.31)
Requirement already satisfied: python-dateutil>=2.8.2 in /usr/local/lib/python3.11/dist-packages (from pandas->evaluate) (2.8.2)
Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.11/dist-packages (from pandas->evaluate) (2025.1)
Requirement already satisfied: tzdata>=2022.7 in /usr/local/lib/python3.11/dist-packages (from pandas->evaluate) (2025.1)
Requirement already satisfied: aiohappyeyeballs>=2.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (2.4.6)
Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (1.3.2)
Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (25.1.0)
Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (1.5.0)
Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (6.1.0)
Requirement already satisfied: propcache>=0.2.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (0.2.1)
Requirement already satisfied: yarl<2.0,>=1.17.0 in /usr/local/lib/python3.11/dist-packages (from aiohttp->datasets>=2.0.0->evaluate) (1.18.3)
Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.11/dist-packages (from python-dateutil>=2.8.2->pandas->evaluate) (1.17.0)
Downloading evaluate-0.4.3-py3-none-any.whl (84 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 84.0/84.0 kB 6.6 MB/s eta 0:00:00
Installing collected packages: evaluate
Successfully installed evaluate-0.4.3
```

```python
from transformers import pipeline
from evaluate import load  # Correct import

# Load evaluation metric
bleu = load("bleu")  # Correct function

# Define test queries and expected answers
test_queries = [
    "What are the ingredients for No-Bake Nut Cookies?",
    "How do you prepare Peanut Butter Cup Cookies?"
]
expected_answers = [
    "2 cups quick-cook oats, 1/2 cup peanut butter, 1/2 cup margarine...",
    "1 c. sugar, 1/2 c. margarine, 1/2 c. peanut butter..."
]

# Generate responses from fine-tuned Mistral
responses = [generate_response(q) for q in test_queries]

# Compute BLEU score
bleu_score = bleu.compute(predictions=responses, references=[[ans] for ans in expected_answers])
print("BLEU Score:", bleu_score)

# Check raw responses
for query, response in zip(test_queries, responses):
    print(f"\n🔍 Query: {query}\n🤖 Model Response: {response}")
```

```result
Downloading builder script:   0%|          | 0.00/5.94k [00:00<?, ?B/s]
```

```result
Downloading extra modules:   0%|          | 0.00/1.55k [00:00<?, ?B/s]
```

```result
Downloading extra modules:   0%|          | 0.00/3.34k [00:00<?, ?B/s]
```

```result
BLEU Score: {'bleu': 0.021781050756019417, 'precisions': [0.07713498622589532, 0.024930747922437674, 0.013927576601671309, 0.008403361344537815], 'brevity_penalty': 1.0, 'length_ratio': 8.642857142857142, 'translation_length': 363, 'reference_length': 42}

🔍 Query: What are the ingredients for No-Bake Nut Cookies?
🤖 Model Response: Answer the query using the retrieved context:

What is the source for No-Bake Nut Cookies?
What is the ingredients for Peanut Butter Cup Cookies?

Query: What are the ingredients for No-Bake Nut Cookies?
Answer: 1/2 c. sugar, 1/2 c. milk, 1 1/2 tbsp. butter, 1/4 c. boiling water, 3 1/2 tsp. Toll House chocolate chips, 1/2 c. chopped peanuts, 1 c. chopped dates, 1 c. crushed graham crackers, 1/2 c. peanut butter

Query: What are the ingredients for No-Bake Nut Cookies?
Answer: 1/2 c. sugar, 1/2 c. milk, 1 1/2 tbsp. butter, 1/4 c. boiling water, 3 1/2 tsp. Toll House chocolate chips, 1/2 c. chopped peanuts, 1 c. chopped dates, 1 c. crushed graham crackers, 1/2 c

🔍 Query: How do you prepare Peanut Butter Cup Cookies?
🤖 Model Response: Answer the query using the retrieved context:

What is the directions for Peanut Butter Cup Cookies?
What is the directions for Crazy Peanut Butter Cookies?
What is the source for Peanut Butter Cup Cookies?

Query: How do you prepare Peanut Butter Cup Cookies?
Answer: Mix butter, peanut butter and sugar; add eggs, vanilla and flour. Stir in peanut butter cups. Use 1 tablespoon of dough for each cookie, shape into ball and roll in powdered sugar. Bake at 325° for 8 to 10 minutes. Yields 48 to 50.

Query: What is the directions for Crazy Peanut Butter Cookies?
Answer: Mix all ingredients together. Roll into ball and roll in powdered sugar. Bake at 325° for 8 to 10 minutes. Yields 48 to 50.

Query: Where did you find the source for Peanut Butter Cup Cookies?
Answer: www.cookbooks.com/Recipe-Details.aspx?id=1
```

```python
import torch
import faiss
import numpy as np
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"  # Ensure this is correct
lora_model_path = "./mistral_lora_finetuned_duplicate"  # Ensure this exists locally

# Load base model with optimized 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Load LoRA fine-tuned adapters correctly
model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

# Move to evaluation mode and clear cache
model.eval()
torch.cuda.empty_cache()

print("✅ Fine-Tuned Mistral Loaded!")

# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

# Load fine-tuned or pretrained SentenceTransformer model
embedding_model_path = "all-MiniLM-L6-v2"  # Change this if you fine-tuned your own model
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

print("✅ Pretrained SentenceTransformer Loaded!")

# ========================== STEP 3: Load FAISS Index ========================== #

# Define FAISS index path
faiss_index_path = "faiss_index.bin"

# Load FAISS index (ensure the file exists)
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]

# ========================== STEP 4: RAG Retrieval Function ========================== #

def retrieve_relevant_docs(query, top_k=3):
    """Retrieve top-k relevant documents from FAISS index based on query embeddings."""
    query_embedding = embedding_model.encode([query], convert_to_numpy=True)
    distances, indices = faiss_index.search(query_embedding, top_k)

    retrieved_docs = []
    for idx, score in zip(indices[0], distances[0]):
        if idx < len(documents):
            retrieved_docs.append((documents[idx], score))

    return retrieved_docs

# ========================== STEP 5: Generate Response with Mistral ========================== #
# Ensure the tokenizer has a valid padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Use EOS as padding
    if tokenizer.pad_token is None:  # If EOS is missing, add [PAD]
        tokenizer.add_special_tokens({'pad_token': '[PAD]'})
        model.resize_token_embeddings(len(tokenizer))

def generate_response(query):
    """Retrieve relevant documents and generate a response using Mistral."""
    retrieved_docs = retrieve_relevant_docs(query)

    context_text = "\n".join([doc[0] for doc in retrieved_docs if doc[1] > 0.1])

    prompt = f"Answer the query using the retrieved context:\n\n{context_text}\n\nQuery: {query}\nAnswer:"

    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512).to("cuda")

    output = model.generate(
        **inputs,
        max_length=256,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.pad_token_id
    )

    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response

# ========================== TEST EXAMPLE ========================== #

query = "What are the ingredients for No-Bake Nut Cookies?"
response = generate_response(query)

print("\n🔍 Query:", query)
print("📄 Retrieved Context:")
for doc, score in retrieve_relevant_docs(query):
    print(f"- {doc} (Score: {score:.4f})")

print("\n🤖 Mistral's Response:", response)
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
✅ Pretrained SentenceTransformer Loaded!
✅ FAISS index loaded successfully!

🔍 Query: What are the ingredients for No-Bake Nut Cookies?
📄 Retrieved Context:
- What is the ingredients for No-Bake Nut Cookies? (Score: 0.0044)
- What is the source for No-Bake Nut Cookies? (Score: 0.2998)
- What is the ingredients for Peanut Butter Cup Cookies? (Score: 0.4072)

🤖 Mistral's Response: Answer the query using the retrieved context:

What is the source for No-Bake Nut Cookies?
What is the ingredients for Peanut Butter Cup Cookies?

Query: What are the ingredients for No-Bake Nut Cookies?
Answer: 1 1/2 c. peanut butter, 1 c. sugar, 1 c. milk, 1/2 tsp. salt, 1 tsp. vanilla, 2 c. chopped nuts, 1 1/2 c. shredded coconut, 1 1/2 c. quick-cook oats, 1 1/2 tsp. softened butter, 1 1/2 c. milk, 1/2 c. brown sugar, 1/2 c. flour, 1/2 tsp. salt, 1/2 tsp. vanilla, 1 1/2 tsp. baking soda, 1 1/2 tsp. buttermilk, 1 1/2 c. quick-cook oats, 1 1/2 c. chopped nuts, 1 1/2 c
```

```python
import torch
import faiss
import numpy as np
import json
import os
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    Trainer,
    TrainingArguments
)
from peft import PeftModel, LoraConfig, get_peft_model, prepare_model_for_kbit_training
from sentence_transformers import SentenceTransformer
from trl import PPOTrainer, PPOConfig, AutoModelForCausalLMWithValueHead
from tqdm import tqdm

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"
lora_model_path = "./mistral_lora_finetuned_duplicate"
rlhf_model_output_path = "./mistral_rlhf_finetuned"

# Load base model with optimized 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
    if tokenizer.pad_token is None:
        tokenizer.add_special_tokens({'pad_token': '[PAD]'})
        base_model.resize_token_embeddings(len(tokenizer))

# Load LoRA fine-tuned adapters
model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

print("✅ Fine-Tuned Mistral Loaded!")

# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

# Load pretrained SentenceTransformer model
embedding_model_path = "all-MiniLM-L6-v2"
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

print("✅ Pretrained SentenceTransformer Loaded!")

# ========================== STEP 3: Load FAISS Index ========================== #

# Load FAISS index
faiss_index_path = "faiss_index.bin"
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]

# ========================== STEP 4: RAG Retrieval Function ========================== #

def retrieve_relevant_docs(query, top_k=3):
    """Retrieve top-k relevant documents from FAISS index based on query embeddings."""
    query_embedding = embedding_model.encode([query], convert_to_numpy=True)
    distances, indices = faiss_index.search(query_embedding, top_k)

    retrieved_docs = []
    for idx, score in zip(indices[0], distances[0]):
        if idx < len(documents):
            retrieved_docs.append((documents[idx], score))

    return retrieved_docs

# ========================== STEP 5: Generate Response with Mistral ========================== #

def generate_response(model, query, temperature=0.7, max_length=256):
    """Retrieve relevant documents and generate a response using Mistral."""
    retrieved_docs = retrieve_relevant_docs(query)
    context_text = "\n".join([doc[0] for doc in retrieved_docs if doc[1] > 0.1])

    prompt = f"Answer the query using the retrieved context:\n\n{context_text}\n\nQuery: {query}\nAnswer:"

    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512).to("cuda")

    output = model.generate(
        **inputs,
        max_length=max_length,
        temperature=temperature,
        do_sample=True,
        pad_token_id=tokenizer.pad_token_id
    )

    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response, prompt

# ========================== STEP 6: RLHF Setup ========================== #

# Create a reward model (for simplicity, we'll use a mock reward function)
def compute_reward(responses, reference_responses=None):
    """
    Mock reward function - in a real scenario, this would be:
    1. A trained reward model that scores responses
    2. Human feedback converted to rewards
    3. A combination of automated metrics
    """
    # Mock reward based on response length and keyword presence
    rewards = []

    # Keywords that might indicate good responses
    positive_keywords = ["detailed", "comprehensive", "helpful", "accurate", "clear"]

    for response in responses:
        # Base reward
        reward = 0.5

        # Length component (slightly favor longer, more detailed responses)
        length_component = min(len(response.split()) / 100, 0.3)  # Cap at 0.3
        reward += length_component

        # Keyword component
        keyword_matches = sum(1 for keyword in positive_keywords if keyword.lower() in response.lower())
        keyword_component = min(keyword_matches * 0.05, 0.2)  # Cap at 0.2
        reward += keyword_component

        rewards.append(reward)

    return torch.tensor(rewards)

# ========================== STEP 7: RLHF Dataset ========================== #

class RLHFDataset(Dataset):
    def __init__(self, queries):
        self.queries = queries

    def __len__(self):
        return len(self.queries)

    def __getitem__(self, idx):
        return {"query": self.queries[idx]}

# Create a dataset of queries for RLHF
# In a real-world scenario, these would be diverse and representative queries
rlhf_queries = [
    "What are the ingredients for No-Bake Nut Cookies?",
    "How do I make a vegetable lasagna?",
    "What's the best way to prepare salmon?",
    "Give me a recipe for chocolate chip cookies",
    "How can I make a gluten-free pizza crust?",
    # Add more diverse queries here
]

rlhf_dataset = RLHFDataset(rlhf_queries)

# ========================== STEP 8: Custom RLHF Training ========================== #

# Prepare model for RLHF
def prepare_for_rlhf(model):
    """Convert the LoRA model to a model with value head for RLHF."""
    # First convert to base model
    merged_model = model.merge_and_unload()

    # Add value head for PPO
    rlhf_model = AutoModelForCausalLMWithValueHead.from_pretrained(
        merged_model,
        device_map="auto"
    )

    # Use LoRA for efficient training
    lora_config = LoraConfig(
        r=16,  # Rank
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    # Prepare the model for training
    rlhf_model = prepare_model_for_kbit_training(rlhf_model)
    rlhf_model = get_peft_model(rlhf_model, lora_config)

    return rlhf_model

# Get the available PPOConfig parameters
def get_compatible_ppo_config():
    """Create a compatible PPO config based on what parameters are accepted."""
    try:
        # Try with minimal parameters first
        return PPOConfig(
            learning_rate=1.5e-5,
            batch_size=4,
            mini_batch_size=2,
        )
    except TypeError as e:
        print(f"Warning: Error with PPO configuration: {e}")
        print("Falling back to default PPOConfig")
        return PPOConfig()

# Custom training function that doesn't depend on PPOTrainer
def custom_rlhf_training(model, tokenizer, dataset, learning_rate=1.5e-5, n_epochs=3):
    """Custom RLHF training without using PPOTrainer to avoid compatibility issues."""
    print("🚀 Starting Custom RLHF Training...")

    # Prepare model for RLHF
    rlhf_model = prepare_for_rlhf(model)

    # Set up optimizer
    optimizer = torch.optim.AdamW(rlhf_model.parameters(), lr=learning_rate)

    # Set up dataloader
    dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

    # Training loop
    for epoch in range(n_epochs):
        print(f"Epoch {epoch+1}/{n_epochs}")

        epoch_rewards = []

        for batch_idx, batch in enumerate(dataloader):
            queries = batch["query"]
            batch_rewards = []

            for query in tqdm(queries, desc="Processing queries"):
                # Get context using RAG
                retrieved_docs = retrieve_relevant_docs(query)
                context = "\n".join([doc[0] for doc in retrieved_docs if doc[1] > 0.1])

                prompt = f"Answer the query using the retrieved context:\n\n{context}\n\nQuery: {query}\nAnswer:"
                query_tensor = tokenizer(prompt, return_tensors="pt").to(rlhf_model.device)

                # Generate initial response
                with torch.no_grad():
                    initial_output = rlhf_model.generate(
                        **query_tensor,
                        max_length=256,
                        temperature=1.0,
                        do_sample=True,
                        pad_token_id=tokenizer.pad_token_id
                    )

                initial_response = tokenizer.decode(initial_output[0], skip_special_tokens=True)

                # Compute reward for initial response
                initial_reward = compute_reward([initial_response])[0]

                # Forward pass with model for training (use the same input but let model generate)
                optimizer.zero_grad()

                # Forward pass with input_ids
                outputs = rlhf_model(
                    input_ids=query_tensor.input_ids,
                    attention_mask=query_tensor.attention_mask,
                    labels=query_tensor.input_ids  # Use input as target for simplicity
                )

                # Get model output logits and compute value prediction
                logits = outputs.logits
                values = rlhf_model.v_head(outputs.hidden_states[-1])

                # Compute policy loss (encourage higher rewards)
                # This is a simplified version - actual PPO is more complex
                advantage = initial_reward - values.mean()
                policy_loss = -advantage * outputs.loss

                # Value loss (predict the reward accurately)
                value_loss = torch.nn.functional.mse_loss(values.mean(), initial_reward)

                # Combine losses
                loss = policy_loss + 0.5 * value_loss

                # Backward pass
                loss.backward()

                # Clip gradients
                torch.nn.utils.clip_grad_norm_(rlhf_model.parameters(), 1.0)

                # Update model
                optimizer.step()

                # Store reward
                batch_rewards.append(initial_reward.item())

            # Print batch statistics
            avg_reward = sum(batch_rewards) / len(batch_rewards)
            epoch_rewards.extend(batch_rewards)
            print(f"Batch {batch_idx+1}, Average Reward: {avg_reward:.4f}")

            # Save checkpoint periodically
            if batch_idx % 5 == 0:
                rlhf_model.save_pretrained(rlhf_model_output_path)
                print(f"Checkpoint saved to {rlhf_model_output_path}")

        # Print epoch statistics
        avg_epoch_reward = sum(epoch_rewards) / len(epoch_rewards)
        print(f"Epoch {epoch+1} complete. Average Reward: {avg_epoch_reward:.4f}")

    # Save final model
    rlhf_model.save_pretrained(rlhf_model_output_path)
    print("✅ Custom RLHF Training Complete!")

    return rlhf_model

# ========================== STEP 9: Evaluation ========================== #

def evaluate_model(model, test_queries):
    """Evaluate the model on test queries."""
    results = []

    for query in test_queries:
        response, prompt = generate_response(model, query)
        results.append({
            "query": query,
            "prompt": prompt,
            "response": response
        })

    return results

# ========================== STEP 10: Main Function ========================== #

def main():
    # Check if RLHF model already exists
    if os.path.exists(rlhf_model_output_path):
        print("⚠️ RLHF model already exists. Loading from disk...")
        rlhf_model = AutoModelForCausalLMWithValueHead.from_pretrained(
            rlhf_model_output_path,
            device_map="auto"
        )
    else:
        # Try to create PPO config
        try:
            ppo_config = get_compatible_ppo_config()

            # Try using PPOTrainer
            print("Attempting to use PPOTrainer...")
            rlhf_model = prepare_for_rlhf(model)

            ppo_trainer = PPOTrainer(
                config=ppo_config,
                model=rlhf_model,
                tokenizer=tokenizer,
                dataset=rlhf_dataset
            )

            # Run training with PPOTrainer
            for epoch in range(3):
                print(f"PPO Epoch {epoch+1}/3")
                for batch_idx, batch in enumerate(ppo_trainer.dataloader):
                    # Process batch
                    print(f"Processing batch {batch_idx+1}")
                    # ... (PPO training code)

        except Exception as e:
            print(f"Error using PPOTrainer: {e}")
            print("Falling back to custom RLHF implementation")
            # Use custom RLHF training
            rlhf_model = custom_rlhf_training(model, tokenizer, rlhf_dataset)

    # Test the model
    test_queries = [
        "What are the ingredients for No-Bake Nut Cookies?",
        "How do I make a vegetable lasagna?",
        "What's a good recipe for a quick dinner?"
    ]

    print("\n📊 Evaluating RLHF-trained model...")
    rlhf_results = evaluate_model(rlhf_model, test_queries)

    # Print results
    for i, result in enumerate(rlhf_results):
        print(f"\n🔍 Test Query {i+1}: {result['query']}")
        print(f"🤖 RLHF Model Response: {result['response']}")

if __name__ == "__main__":
    main()
```

```result
/usr/local/lib/python3.11/dist-packages/huggingface_hub/utils/_auth.py:94: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
✅ Pretrained SentenceTransformer Loaded!
✅ FAISS index loaded successfully!
Warning: Error with PPO configuration: PPOConfig.__init__() missing 1 required positional argument: 'output_dir'
Falling back to default PPOConfig
Error using PPOTrainer: PPOConfig.__init__() missing 1 required positional argument: 'output_dir'
Falling back to custom RLHF implementation
🚀 Starting Custom RLHF Training...
```

```result
/usr/local/lib/python3.11/dist-packages/peft/tuners/lora/bnb.py:355: UserWarning: Merge lora module to 4-bit linear may get different generations due to rounding errors.
  warnings.warn(
```

```result
Epoch 1/3
```

```result
Processing queries:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result title="Error"
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
<ipython-input-1-f6fe31195eac> in get_compatible_ppo_config()
    201         # Try with minimal parameters first
--> 202         return PPOConfig(
    203             learning_rate=1.5e-5,

TypeError: PPOConfig.__init__() missing 1 required positional argument: 'output_dir'

During handling of the above exception, another exception occurred:

TypeError                                 Traceback (most recent call last)
<ipython-input-1-f6fe31195eac> in main()
    344         try:
--> 345             ppo_config = get_compatible_ppo_config()
    346 

<ipython-input-1-f6fe31195eac> in get_compatible_ppo_config()
    209         print("Falling back to default PPOConfig")
--> 210         return PPOConfig()
    211 

TypeError: PPOConfig.__init__() missing 1 required positional argument: 'output_dir'

During handling of the above exception, another exception occurred:

AttributeError                            Traceback (most recent call last)
/usr/local/lib/python3.11/dist-packages/peft/peft_model.py in __getattr__(self, name)
    823         try:
--> 824             return super().__getattr__(name)  # defer to nn.Module's logic
    825         except AttributeError:

/usr/local/lib/python3.11/dist-packages/torch/nn/modules/module.py in __getattr__(self, name)
   1930                 return modules[name]
-> 1931         raise AttributeError(
   1932             f"'{type(self).__name__}' object has no attribute '{name}'"

AttributeError: 'PeftModelForCausalLM' object has no attribute 'device'

During handling of the above exception, another exception occurred:

AttributeError                            Traceback (most recent call last)
/usr/local/lib/python3.11/dist-packages/peft/tuners/lora/model.py in __getattr__(self, name)
    370         try:
--> 371             return super().__getattr__(name)  # defer to nn.Module's logic
    372         except AttributeError:

/usr/local/lib/python3.11/dist-packages/torch/nn/modules/module.py in __getattr__(self, name)
   1930                 return modules[name]
-> 1931         raise AttributeError(
   1932             f"'{type(self).__name__}' object has no attribute '{name}'"

AttributeError: 'LoraModel' object has no attribute 'device'

During handling of the above exception, another exception occurred:

AttributeError                            Traceback (most recent call last)
<ipython-input-1-f6fe31195eac> in <cell line: 0>()
    386 
    387 if __name__ == "__main__":
--> 388     main()

<ipython-input-1-f6fe31195eac> in main()
    368             print("Falling back to custom RLHF implementation")
    369             # Use custom RLHF training
--> 370             rlhf_model = custom_rlhf_training(model, tokenizer, rlhf_dataset)
    371 
    372     # Test the model

<ipython-input-1-f6fe31195eac> in custom_rlhf_training(model, tokenizer, dataset, learning_rate, n_epochs)
    240 
    241                 prompt = f"Answer the query using the retrieved context:\n\n{context}\n\nQuery: {query}\nAnswer:"
--> 242                 query_tensor = tokenizer(prompt, return_tensors="pt").to(rlhf_model.device)
    243 
    244                 # Generate initial response

/usr/local/lib/python3.11/dist-packages/peft/peft_model.py in __getattr__(self, name)
    826             if name == "base_model":  # see #1892: prevent infinite recursion if class is not initialized
    827                 raise
--> 828             return getattr(self.base_model, name)
    829 
    830     @contextmanager

/usr/local/lib/python3.11/dist-packages/peft/tuners/lora/model.py in __getattr__(self, name)
    373             if name == "model":  # see #1892: prevent infinite recursion if class is not initialized
    374                 raise
--> 375             return getattr(self.model, name)
    376 
    377     def get_peft_config_as_dict(self, inference: bool = False):

/usr/local/lib/python3.11/dist-packages/torch/nn/modules/module.py in __getattr__(self, name)
   1929             if name in modules:
   1930                 return modules[name]
-> 1931         raise AttributeError(
   1932             f"'{type(self).__name__}' object has no attribute '{name}'"
   1933         )

AttributeError: 'AutoModelForCausalLMWithValueHead' object has no attribute 'device'
```

```python
import torch
import faiss
import numpy as np
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"  # Ensure this is correct
lora_model_path = "./mistral_lora_finetuned_duplicate"  # Ensure this exists locally

# Load base model with optimized 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Load LoRA fine-tuned adapters correctly
model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

# Move to evaluation mode and clear cache
model.eval()
torch.cuda.empty_cache()

print("✅ Fine-Tuned Mistral Loaded!")
```

```result
/usr/local/lib/python3.11/dist-packages/huggingface_hub/utils/_auth.py:94: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
```

```python
# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

# Load fine-tuned or pretrained SentenceTransformer model
embedding_model_path = "all-MiniLM-L6-v2"  # Change this if you fine-tuned your own model
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

print("✅ Pretrained SentenceTransformer Loaded!")

# ========================== STEP 3: Load FAISS Index ========================== #

# Define FAISS index path
faiss_index_path = "faiss_index.bin"

# Load FAISS index (ensure the file exists)
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]
```

```result
✅ Pretrained SentenceTransformer Loaded!
✅ FAISS index loaded successfully!
```

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# Load GPT-2 model and tokenizer
model_name = 'gpt2'  # You can use other models such as 'gpt-neo' or 'gpt-j'
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

# Move model to device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Reward model function: Using log likelihood of text as reward
def reward_model(recipe_text):
    inputs = tokenizer(recipe_text, return_tensors="pt").to(device)

    # Forward pass to get logits
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])
        logits = outputs.logits

    # Compute log likelihood of the text (negative log probability)
    shift_logits = logits[..., :-1, :].contiguous()  # Remove the last token from logits
    shift_labels = inputs["input_ids"][..., 1:].contiguous()  # Remove the first token from labels
    loss_fct = torch.nn.CrossEntropyLoss(reduction='none')  # Don't reduce loss to get per-token log likelihood
    log_likelihood = -loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))

    # Return the average log likelihood as the reward score
    return log_likelihood.mean().item()

# Example recipe data to test reward model with
recipe_title = "No-Bake Nut Cookies"
recipe_ingredients = "1 cup oats, 1 cup peanut butter, 1/2 cup honey, 1/4 cup chocolate chips"
recipe_directions = "Mix all ingredients together. Shape into balls and chill for 30 minutes."

# Test the reward model with recipe-related text
reward_title = reward_model(recipe_title)
reward_ingredients = reward_model(recipe_ingredients)
reward_directions = reward_model(recipe_directions)

print(f"Reward score for the recipe title: {reward_title}")
print(f"Reward score for the ingredients: {reward_ingredients}")
print(f"Reward score for the directions: {reward_directions}")
```

```result
config.json:   0%|          | 0.00/665 [00:00<?, ?B/s]
```

```result
model.safetensors:   0%|          | 0.00/548M [00:00<?, ?B/s]
```

```result
generation_config.json:   0%|          | 0.00/124 [00:00<?, ?B/s]
```

```result
tokenizer_config.json:   0%|          | 0.00/26.0 [00:00<?, ?B/s]
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
`loss_type=None` was set in the config but it is unrecognised.Using the default loss: `ForCausalLMLoss`.
```

```result
Reward score for the recipe title: -5.332228183746338
Reward score for the ingredients: -2.198429822921753
Reward score for the directions: -2.918705940246582
```

```python
import torch
import faiss
import numpy as np
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"  # Ensure this is correct
lora_model_path = "./mistral_lora_finetuned_duplicate"  # Ensure this exists locally

# Load base model with optimized 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Load LoRA fine-tuned adapters correctly
model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

# Move to evaluation mode and clear cache
model.eval()
torch.cuda.empty_cache()

print("✅ Fine-Tuned Mistral Loaded!")


# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

# Load fine-tuned or pretrained SentenceTransformer model
embedding_model_path = "all-MiniLM-L6-v2"  # Change this if you fine-tuned your own model
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")

print("✅ Pretrained SentenceTransformer Loaded!")


# ========================== STEP 3: Load FAISS Index ========================== #

# Define FAISS index path
faiss_index_path = "faiss_index.bin"

# Load FAISS index (ensure the file exists)
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]


# ========================== STEP 4: Define Reward Model ========================== #

# Load GPT-2 model and tokenizer for reward model
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load GPT-2 model and tokenizer
model_name = 'gpt2'  # You can use other models such as 'gpt-neo' or 'gpt-j'
reward_model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

# Move model to device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
reward_model.to(device)

# Reward model function: Using log likelihood of text as reward
def reward_model_function(recipe_text):
    inputs = tokenizer(recipe_text, return_tensors="pt").to(device)

    # Forward pass to get logits
    with torch.no_grad():
        outputs = reward_model(**inputs, labels=inputs["input_ids"])
        logits = outputs.logits

    # Compute log likelihood of the text (negative log probability)
    shift_logits = logits[..., :-1, :].contiguous()  # Remove the last token from logits
    shift_labels = inputs["input_ids"][..., 1:].contiguous()  # Remove the first token from labels
    loss_fct = torch.nn.CrossEntropyLoss(reduction='none')  # Don't reduce loss to get per-token log likelihood
    log_likelihood = -loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))

    # Return the average log likelihood as the reward score
    return log_likelihood.mean().item()


# ========================== STEP 5: Query and Retrieve Results ========================== #

# Example recipe data to test reward model with
recipe_title = "No-Bake Nut Cookies"
recipe_ingredients = "1 cup oats, 1 cup peanut butter, 1/2 cup honey, 1/4 cup chocolate chips"
recipe_directions = "Mix all ingredients together. Shape into balls and chill for 30 minutes."

# Test the reward model with recipe-related text
reward_title = reward_model_function(recipe_title)
reward_ingredients = reward_model_function(recipe_ingredients)
reward_directions = reward_model_function(recipe_directions)

print(f"Reward score for the recipe title: {reward_title}")
print(f"Reward score for the ingredients: {reward_ingredients}")
print(f"Reward score for the directions: {reward_directions}")


# ========================== STEP 6: Perform Query Search in FAISS ========================== #

# Define query (you can modify this based on the task)
query = recipe_title

# Ensure query_embedding is a 2D array (1, embedding_dimension)
query_embedding = embedding_model.encode(query, convert_to_tensor=True).unsqueeze(0)  # Add batch dimension

# Use FAISS to retrieve the top 3 documents
k = 3
D, I = faiss_index.search(query_embedding.cpu().numpy(), k)

# Log the retrieved documents
retrieved_documents = [documents[i] for i in I[0]]
print("Retrieved documents:")
for doc in retrieved_documents:
    print(doc)
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
✅ Pretrained SentenceTransformer Loaded!
✅ FAISS index loaded successfully!
```

```result
`loss_type=None` was set in the config but it is unrecognised.Using the default loss: `ForCausalLMLoss`.
```

```result
Reward score for the recipe title: -5.332228183746338
Reward score for the ingredients: -2.198429822921753
Reward score for the directions: -2.918705940246582
Retrieved documents:
What is the directions for No-Bake Nut Cookies?
What is the source for No-Bake Nut Cookies?
What is the ingredients for No-Bake Nut Cookies?
```

```python
import torch
import faiss
import numpy as np
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from sentence_transformers import SentenceTransformer

# ========================== STEP 1: Load Fine-Tuned Mistral Model ========================== #

print("Loading Fine-Tuned Mistral Model...")

# Define model paths
base_model_path = "mistralai/Mistral-7B-Instruct-v0.1"
lora_model_path = "./mistral_lora_finetuned_duplicate"

# Load base model with optimized 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=quantization_config,
    device_map="auto"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

# Ensure the tokenizer has a padding token
if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': tokenizer.eos_token})

# Resize model embeddings to accommodate new token
base_model.resize_token_embeddings(len(tokenizer))

# Load LoRA fine-tuned adapters correctly
model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

# Move to evaluation mode and clear cache
model.eval()
torch.cuda.empty_cache()

print("✅ Fine-Tuned Mistral Loaded!")

# ========================== STEP 2: Load SentenceTransformer for Retrieval ========================== #

print("Loading SentenceTransformer for embedding generation...")
embedding_model_path = "all-MiniLM-L6-v2"
embedding_model = SentenceTransformer(embedding_model_path, device="cuda")
print("✅ Pretrained SentenceTransformer Loaded!")

# ========================== STEP 3: Load FAISS Index ========================== #

print("Loading FAISS Index...")
faiss_index_path = "faiss_index.bin"
faiss_index = faiss.read_index(faiss_index_path)
print("✅ FAISS index loaded successfully!")

# Load stored documents
dataset_path = "rag_dataset.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    rag_data = json.load(f)
documents = [entry["question"] for entry in rag_data]
print(f"Loaded {len(documents)} documents from the dataset.")

# ========================== STEP 4: Define Reward Model ========================== #

print("Loading GPT-2 Reward Model...")
from transformers import GPT2LMHeadModel, GPT2Tokenizer

model_name = 'gpt2'
reward_model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer_reward = GPT2Tokenizer.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
reward_model.to(device)

def reward_model_function(recipe_text):
    inputs = tokenizer_reward(recipe_text, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = reward_model(**inputs, labels=inputs["input_ids"])
        logits = outputs.logits
    shift_logits = logits[..., :-1, :].contiguous()
    shift_labels = inputs["input_ids"][..., 1:].contiguous()
    loss_fct = torch.nn.CrossEntropyLoss(reduction='none')
    log_likelihood = -loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))
    return log_likelihood.mean().item()

print("✅ GPT-2 Reward Model Loaded!")

# ========================== STEP 5: Query and Retrieve Results ========================== #

print("Performing Query and Reward Calculation...")
recipe_title = "No-Bake Nut Cookies"
recipe_ingredients = "1 cup oats, 1 cup peanut butter, 1/2 cup honey, 1/4 cup chocolate chips"
recipe_directions = "Mix all ingredients together. Shape into balls and chill for 30 minutes."

reward_title = reward_model_function(recipe_title)
reward_ingredients = reward_model_function(recipe_ingredients)
reward_directions = reward_model_function(recipe_directions)

print(f"Reward score for the recipe title: {reward_title}")
print(f"Reward score for the ingredients: {reward_ingredients}")
print(f"Reward score for the directions: {reward_directions}")

# ========================== STEP 6: Perform Query Search in FAISS ========================== #

print("Performing FAISS Search with Query...")
query = recipe_title
query_embedding = embedding_model.encode(query, convert_to_tensor=True).unsqueeze(0)
k = 3
D, I = faiss_index.search(query_embedding.cpu().numpy(), k)
retrieved_documents = [documents[i] for i in I[0]]
print("Retrieved documents:")
for idx, doc in enumerate(retrieved_documents):
    print(f"{idx+1}. {doc}")

# ========================== STEP 7: Generate Answer Using Fine-Tuned Mistral Model ========================== #

print("Generating answer using Fine-Tuned Mistral...")
context = query + " " + " ".join(retrieved_documents)
inputs = tokenizer(context, return_tensors="pt", truncation=True, padding=True, max_length=1024).to(device)
outputs = model.generate(inputs["input_ids"], max_length=150, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
generated_answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(f"Generated Answer: {generated_answer}")

print("Execution Complete!")
```

```result
Loading Fine-Tuned Mistral Model...
```

```result
Loading checkpoint shards:   0%|          | 0/2 [00:00<?, ?it/s]
```

```result
✅ Fine-Tuned Mistral Loaded!
Loading SentenceTransformer for embedding generation...
✅ Pretrained SentenceTransformer Loaded!
Loading FAISS Index...
✅ FAISS index loaded successfully!
Loaded 1000 documents from the dataset.
Loading GPT-2 Reward Model...
```

```result
The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
Setting `pad_token_id` to `eos_token_id`:2 for open-end generation.
The attention mask is not set and cannot be inferred from input because pad token is same as eos token. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
```

```result
✅ GPT-2 Reward Model Loaded!
Performing Query and Reward Calculation...
Reward score for the recipe title: -5.332228183746338
Reward score for the ingredients: -2.198429822921753
Reward score for the directions: -2.918705940246582
Performing FAISS Search with Query...
Retrieved documents:
1. What is the directions for No-Bake Nut Cookies?
2. What is the source for No-Bake Nut Cookies?
3. What is the ingredients for No-Bake Nut Cookies?
Generating answer using Fine-Tuned Mistral...
Generated Answer: No-Bake Nut Cookies What is the directions for No-Bake Nut Cookies? What is the source for No-Bake Nut Cookies? What is the ingredients for No-Bake Nut Cookies?
### Answer: 1/2 c. margarine, 2 Tbsp. peanut butter (smooth or crunchy), 3 Tbsps. unsweetened cocoa powder (not hot chocolate) or 4 oz. semi-sweet chocolate chips, melted in microwave or double-boiler, then cooled to lukewarm (about 90° F. on thermometer inserted in center of chocolate). Mix all ingredients together
Execution Complete!
```

```python
# ========================== STEP 1: Define Other Example Data ========================== #

# Example 1: Chocolate Chip Cookies
recipe_title_1 = "Chocolate Chip Cookies"
recipe_ingredients_1 = "2 1/4 cups all-purpose flour, 1/2 teaspoon baking soda, 1 cup unsalted butter, 3/4 cup white sugar, 3/4 cup packed brown sugar, 1 teaspoon vanilla extract, 2 large eggs, 2 cups semisweet chocolate chips"
recipe_directions_1 = "Preheat oven to 350°F. Beat butter, white sugar, and brown sugar in a large bowl. Add eggs and vanilla extract, mix. Gradually add flour and baking soda. Stir in chocolate chips. Drop dough by rounded spoonfuls onto baking sheets. Bake for 10-12 minutes."

# Example 2: Spaghetti Bolognese
recipe_title_2 = "Spaghetti Bolognese"
recipe_ingredients_2 = "1 tablespoon olive oil, 1 onion, finely chopped, 2 garlic cloves, minced, 1 carrot, diced, 2 celery stalks, diced, 1 lb ground beef, 1 can crushed tomatoes, 1/4 cup red wine, 1 teaspoon dried oregano, 1 teaspoon dried basil, 1/2 teaspoon salt, 1/4 teaspoon pepper, 1 lb spaghetti"
recipe_directions_2 = "Heat olive oil in a large skillet over medium heat. Add onion, garlic, carrot, and celery, cooking until soft. Add ground beef and cook until browned. Stir in tomatoes, wine, oregano, basil, salt, and pepper. Simmer for 30 minutes. Serve over cooked spaghetti."

# Example 3: Chicken Alfredo
recipe_title_3 = "Chicken Alfredo"
recipe_ingredients_3 = "2 tablespoons butter, 2 chicken breasts, cut into strips, 2 cloves garlic, minced, 1 cup heavy cream, 1 cup grated Parmesan cheese, 1/2 cup chopped parsley, 12 oz fettuccine pasta"
recipe_directions_3 = "Cook fettuccine according to package directions. In a skillet, melt butter over medium heat. Add chicken and garlic, cooking until chicken is browned. Stir in heavy cream and Parmesan cheese, simmering until thickened. Toss pasta with sauce and chicken, then sprinkle with parsley."

# ========================== STEP 2: Reward Model Check for Each Example ========================== #

# Test with Example 1 (Chocolate Chip Cookies)
reward_title_1 = reward_model_function(recipe_title_1)
reward_ingredients_1 = reward_model_function(recipe_ingredients_1)
reward_directions_1 = reward_model_function(recipe_directions_1)

print(f"Example 1 (Chocolate Chip Cookies) Reward scores:")
print(f"Reward score for the recipe title: {reward_title_1}")
print(f"Reward score for the ingredients: {reward_ingredients_1}")
print(f"Reward score for the directions: {reward_directions_1}\n")

# Test with Example 2 (Spaghetti Bolognese)
reward_title_2 = reward_model_function(recipe_title_2)
reward_ingredients_2 = reward_model_function(recipe_ingredients_2)
reward_directions_2 = reward_model_function(recipe_directions_2)

print(f"Example 2 (Spaghetti Bolognese) Reward scores:")
print(f"Reward score for the recipe title: {reward_title_2}")
print(f"Reward score for the ingredients: {reward_ingredients_2}")
print(f"Reward score for the directions: {reward_directions_2}\n")

# Test with Example 3 (Chicken Alfredo)
reward_title_3 = reward_model_function(recipe_title_3)
reward_ingredients_3 = reward_model_function(recipe_ingredients_3)
reward_directions_3 = reward_model_function(recipe_directions_3)

print(f"Example 3 (Chicken Alfredo) Reward scores:")
print(f"Reward score for the recipe title: {reward_title_3}")
print(f"Reward score for the ingredients: {reward_ingredients_3}")
print(f"Reward score for the directions: {reward_directions_3}\n")


# ========================== STEP 3: FAISS Search and Answer Generation ========================== #

# Perform FAISS search and generate answer for each example
def perform_faiss_search_and_generate_answer(query):
    print(f"\nPerforming FAISS Search for Query: {query}")

    # Query embedding
    query_embedding = embedding_model.encode(query, convert_to_tensor=True).unsqueeze(0)

    # Perform FAISS search
    D, I = faiss_index.search(query_embedding.cpu().numpy(), 3)
    retrieved_documents = [documents[i] for i in I[0]]

    print("Retrieved documents:")
    for idx, doc in enumerate(retrieved_documents):
        print(f"{idx+1}. {doc}")

    # Combine query and retrieved documents to form context
    context = query + " " + " ".join(retrieved_documents)

    # Tokenize the context
    inputs = tokenizer(context, return_tensors="pt", truncation=True, padding=True, max_length=1024).to(device)

    # Generate answer using Mistral
    outputs = model.generate(inputs["input_ids"], max_length=150, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
    generated_answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    print(f"Generated Answer: {generated_answer}")

# Example 1: Query and generate answer for Chocolate Chip Cookies
perform_faiss_search_and_generate_answer(recipe_title_1)

# Example 2: Query and generate answer for Spaghetti Bolognese
perform_faiss_search_and_generate_answer(recipe_title_2)

# Example 3: Query and generate answer for Chicken Alfredo
perform_faiss_search_and_generate_answer(recipe_title_3)

print("Execution Complete!")
```

```result
Example 1 (Chocolate Chip Cookies) Reward scores:
Reward score for the recipe title: -5.023141384124756
Reward score for the ingredients: -1.543581485748291
Reward score for the directions: -2.195443868637085

Example 2 (Spaghetti Bolognese) Reward scores:
Reward score for the recipe title: -3.7151474952697754
Reward score for the ingredients: -1.830509901046753
Reward score for the directions: -1.8119031190872192

Example 3 (Chicken Alfredo) Reward scores:
Reward score for the recipe title: -6.002618312835693
Reward score for the ingredients: -2.3091678619384766
Reward score for the directions: -2.3142621517181396


Performing FAISS Search for Query: Chocolate Chip Cookies
```

```result
The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
Setting `pad_token_id` to `eos_token_id`:2 for open-end generation.
```

```result
Retrieved documents:
1. What is the source for Chicago Crunchy Chocolate Chip Cookies?
2. What is the ingredients for Chicago Crunchy Chocolate Chip Cookies?
3. What is the directions for Chicago Crunchy Chocolate Chip Cookies?
```

```result
The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
Setting `pad_token_id` to `eos_token_id`:2 for open-end generation.
```

```result
Generated Answer: Chocolate Chip Cookies What is the source for Chicago Crunchy Chocolate Chip Cookies? What is the ingredients for Chicago Crunchy Chocolate Chip Cookies? What is the directions for Chicago Crunchy Chocolate Chip Cookies? http://www.cookbooks.com/Recipe-Details.aspx?id=10597577&source=link

Performing FAISS Search for Query: Spaghetti Bolognese
Retrieved documents:
1. What is the source for Summer Spaghetti?
2. What is the source for Chicken Spaghetti?
3. What is the source for Baked Spaghetti?
```

```result
The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
Setting `pad_token_id` to `eos_token_id`:2 for open-end generation.
```

```result
Generated Answer: Spaghetti Bolognese What is the source for Summer Spaghetti? What is the source for Chicken Spaghetti? What is the source for Baked Spaghetti?
### Answer: www.cookbooks.com/Recipe-Details.aspx?id=10595774&source=link
1. Preheat oven to 350°.
2. In a large skillet, cook ground beef over medium-high heat until browned, breaking it into small pieces with a spoon, about 8 minutes. Drain off fat. Add onion, garlic and bell pepper; cook and stir until vegetables are crisp-t

Performing FAISS Search for Query: Chicken Alfredo
Retrieved documents:
1. What is the ingredients for Chicken Spaghetti?
2. What is the ingredients for Casserole Italiano?
3. What is the ingredients for Spaghetti Sauce To Can?
Generated Answer: Chicken Alfredo What is the ingredients for Chicken Spaghetti? What is the ingredients for Casserole Italiano? What is the ingredients for Spaghetti Sauce To Can?
### Answer: 1 lb. boneless, skinless chicken breast, cut into bite-sized pieces, 2 Tbsp. olive oil or melted butter, salt and pepper to taste., 3/4 c. butter or margarine (softened), 8 oz. cream cheese, softened., (2 cans) Campbell's Condensed Cream of Mushroom Soup, undiluted, (1 can) condensed cream of broccoli soup (not creamed),
Execution Complete!
```

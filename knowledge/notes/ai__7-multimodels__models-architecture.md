# Pretraining:
**Definition:** Training a model on a large amount of text data to learn general language patterns (like grammar and word relationships) without focusing on a specific task.

**Usage in NLP:** 
- Helps the model understand language structure (syntax, semantics).
- Example: A model like BERT is pretrained on vast text sources like books and articles.


# Post-training (Fine-tuning):
**Definition:** After pretraining, the model is further trained on a smaller, task-specific dataset to adapt it to a specific NLP task (like sentiment analysis or translation).

**Usage in NLP:** 
- Tailors the pretrained model to perform well on a particular task.
- Example: Fine-tuning BERT for sentiment analysis by training it on a dataset with labeled positive/negative reviews.



| **Aspect**                | **Base Model**                                               | **Instruction-Tuned Model**                                        |
|---------------------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| **Definition**             | A language model pre-trained on a broad range of general data without specific task optimization. | A language model fine-tuned with specific instructions to improve its performance on certain tasks. |
| **Training Method**        | Trained using unsupervised learning on diverse, general text data. | Further trained with labeled datasets containing task-specific instructions and responses. |
| **Output Type**            | Can be random, general, or diverse but lacks focus.         | More structured, coherent, and aligned with human expectations for specific tasks. |
| **Performance**            | Can generate text for a wide range of tasks but may be imprecise or inconsistent. | Provides more reliable, precise, and controlled outputs, particularly in tasks like Q&A and chat. |
| **Use Cases**              | Text generation, summarization, translation, general queries. | Chatbots, question answering, structured outputs like code generation, summarization, and customer support. |
| **Flexibility**            | Highly flexible but may struggle with task-specific precision. | Less flexible but excels at task-specific applications. |
| **Real-Life Example**      | OpenAI GPT-2 (without specific instruction tuning).         | OpenAI GPT-3.5 or GPT-4 (fine-tuned for conversational tasks or specific use cases). |



Base model to post-trained on chatting is good model...they are post trained on data of chat like
https://atlas.nomic.ai/data/stingning/ultrachat

---
---

LoRA (Low-Rank Adaptation) is a technique for efficiently fine-tuning large language models (LLMs) for specific tasks by adding low-rank matrices to the frozen, pre-trained model, thereby adapting it without retraining all parameters[1]. This approach significantly reduces the number of trainable parameters, leading to reduced memory footprint, faster training, and the feasibility of using less powerful hardware[2][3]. LoRA decomposes weight update matrices into smaller matrices, reducing computational overhead and allowing a base model to be shared across multiple tasks with small LoRA modules[3][4]. The technique's linear design introduces no inference latency and can be applied across various types of neural networks, though it is predominantly showcased within NLP[2][3]. LoRA is versatile and supported for use in various applications and can be combined with other training techniques[6]. It offers a balance between adaptation and computational efficiency, making it a practical approach for adapting large pre-trained models[3][4][5].

---
---


# Knowledge Distillation

## 1. Definition
Knowledge Distillation (KD) is a model compression technique where a smaller **student** model learns to replicate the behavior of a larger **teacher** model. The goal is to reduce computational cost while maintaining high performance.

## 2. Process Overview
1. **Train the Teacher Model**: A large, well-performing neural network is trained on the dataset.  
2. **Generate Soft Labels**: The teacher produces probability distributions instead of hard labels.  
3. **Train the Student Model**: The student learns using both:  
   - True labels (cross-entropy loss).  
   - Soft labels (KL-divergence loss).  

## 3. Loss Function
$$
L = (1-\alpha) H(y, S) + \alpha D_{KL}(T, S)
$$
where:  
- `H(y, S)`: Cross-entropy loss with true labels.  
- `D_{KL}(T, S)`: KL divergence loss between teacher (`T`) and student (`S`).  
- `α`: Balance factor between hard and soft label learning.  

## 4. Advantages
| Feature        | Benefit                                    |
|---------------|-------------------------------------------|
| **Compression** | Reduces model size significantly       |
| **Efficiency** | Faster inference on edge devices       |
| **Performance** | Retains most of the teacher's accuracy |

## 5. Use Cases
1. **Natural Language Processing (NLP)**
   - BERT → TinyBERT  
   - GPT-3 → DistilGPT  

2. **Computer Vision**
   - ResNet-152 → MobileNet  
   - EfficientNet → EfficientNet-Lite  

3. **Speech Recognition**
   - Large ASR models → Small ASR models  

## 6. Summary
- Knowledge Distillation allows a smaller model to learn from a larger one.  
- It helps in model compression without significant accuracy loss.  
- Commonly used in NLP, computer vision, and speech recognition.  
```
```

---
---

<img src="kb-media:a1e0fb39c0a648fa5264.png" alt="Sample Image" width="400"/>


## never trust model but ask it to use tool like coding or web search because model can't see character of strings but they can see only tokens... thats y strabarry has two r's in previous it is sayin..now it is trained with way of answering by openai employees......

why the fuck??? can we change architecture

---
---

---
---

https://bbycroft.net/llm 

### Multimodal AI Models by Year

1. **DALL-E** (2021) - OpenAI's model that generates images from textual descriptions, marking an early significant step in multimodal AI.

2. **CLIP (Contrastive Language-Image Pre-training)** (2021) - Also from OpenAI, CLIP aligns text and images for tasks like image classification.

3. **Flamingo** (2022) - Developed by DeepMind, this model integrates visual and textual features for tasks such as image captioning and visual question answering.

4. **ChatGPT** (November 2022) - Initially a unimodal model focused on text, it laid the groundwork for future multimodal capabilities.

5. **GPT-4** (March 2023) - Enhanced capabilities in text generation, serving as a precursor to multimodal functionalities.

6. **Gemini** (December 2023) - Google’s natively multimodal model capable of processing text, images, audio, video, and code.

7. **GPT-4o** (February 2024) - OpenAI's advanced multimodal model that processes and generates multiple data types in real-time.

8. **Claude 3** (March 2024) - Anthropic's model with enhanced vision capabilities, integrating text and image processing.

9. **Meta ImageBind** (April 2024) - Supports six modalities: text, audio, visuals, movement, thermal, and depth data.

10. **GPT-4o Mini** (July 2024) - A smaller variant of GPT-4o designed for efficiency while maintaining multimodal functionality.

11. **Claude 3.5 Sonnet** (July 2024) - An upgraded version of Claude with improved vision and reasoning capabilities.

This timeline highlights the evolution of multimodal AI models from their inception to the present day, showcasing advancements in integrating various data types for more complex interactions and outputs.

# Differences between ai agents vs multimodal ai :
**Functionality** :

AI Agents are designed primarily for task execution, decision-making, and interaction with environments (e.g., customer service bots, autonomous vehicles).

Multimodal AI Models, such as CLIP or DALL-E, are specifically focused on integrating multiple types of data (text, images, audio) for tasks like image generation or understanding context from various inputs.

---
---
Here's a table organizing the topics from your syllabus into **Retrieval-Augmented Generation (RAG) with Knowledge Graphs** and **AI Agents**:

| **Category**                | **Unit** | **Topics**                                                                                               |
|-----------------------------|----------|----------------------------------------------------------------------------------------------------------|
| **AI Agents**               | Unit 1   | - Intelligent agent concepts<br>- Rationality and rational agent with performance measures<br>- Flexibility and intelligent agents<br>- Problem-solving in AI:<br>&nbsp;&nbsp;- Problem-solving process<br>&nbsp;&nbsp;- Formulating problems |
|                             |          | - Search techniques:<br>&nbsp;&nbsp;- Uninformed search<br>&nbsp;&nbsp;- Breadth-first and Depth-first search<br>&nbsp;&nbsp;- Iterative deepening, Bi-directional search |
|                             | Unit 4   | - Rational and intelligent agent concepts<br>- Task environment and its properties                           |
|                             | Unit 6   | - Game theory problems<br>- Game playing, Alpha-beta pruning, and Minimax algorithm                         |
|                             |          | - Constraint satisfaction problems (CSP):<br>&nbsp;&nbsp;- Problem constraints and representation<br>&nbsp;&nbsp;- CSP-solving methods like backtracking and heuristics<br>&nbsp;&nbsp;- Intelligent backtracking |
| **Retrieval-Augmented Generation (RAG) with Knowledge Graphs** | Unit 2 | - Knowledge and reasoning approaches<br>- Knowledge base agents                                             |
|                             |          | - Logic and reasoning:<br>&nbsp;&nbsp;- Propositional logic (syntax, semantics, and inference)<br>&nbsp;&nbsp;- Predicate logic and resolution |
|                             |          | - Probabilistic reasoning:<br>&nbsp;&nbsp;- Bayesian probability and belief networks                         |
|                             |          | - Knowledge representation schemes:<br>&nbsp;&nbsp;- Using frames and semantic nets                         |
|                             | Unit 5   | - Local search algorithms:<br>&nbsp;&nbsp;- Hill climbing, Simulated annealing, Local beam search           |
|                             |          | - Probabilistic reasoning over time                                                                        |

This organization aligns the syllabus topics specifically with the **RAG** and **AI Agents** areas, focusing on relevant knowledge representation, reasoning, and agent-based problem-solving methods.

---
---

OmniHuman - videogeneration model.

DeepSeek-V3 Technical Report - reasoning model

<a href="https://colab.research.google.com/github/satyaprakashdhfm/NLP_notebooks/blob/main/6_LLM_Distillation.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

```python
#REDACTED_GOOGLE_API_KEY
```

```python
# Install Google AI SDK
!pip install -q google-generativeai
```

```python


import google.generativeai as genai

# Set up Gemini API key
GEMINI_API_KEY = "REDACTED_GOOGLE_API_KEY"
genai.configure(api_key=GEMINI_API_KEY)

# Define a function to get responses from Gemini Flash 2.0
def get_gemini_response(prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text

# Example queries
prompts = [
    "What are the key differences between GPT-4 and Gemini?",
    "Explain quantum mechanics in simple terms.",
    "How does backpropagation work in neural networks?",
]

# Generate and store responses
responses = []
for prompt in prompts:
    answer = get_gemini_response(prompt)
    responses.append({"prompt": prompt, "response": answer})
    print(f"Q: {prompt}\nA: {answer}\n{'='*50}")

# Save responses to a JSON file
import json
with open("gemini_responses.json", "w") as f:
    json.dump(responses, f)

print("Responses saved successfully!")
```

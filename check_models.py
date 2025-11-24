import google.generativeai as genai
import os

# ⚠️ Replace with your NEW, valid API key (do not use the leaked one)
genai.configure(api_key="AIzaSyCYcZWHVdlmWbGJPzNAPlR1VsU1Jtxsl3c")

print("Fetching available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")

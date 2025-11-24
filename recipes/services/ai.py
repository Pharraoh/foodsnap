# recipes/services/ai.py
import os
import json
from django.conf import settings
import google.generativeai as genai

# Configure Gemini (replace with your actual API key setup)
genai.configure(api_key="AIzaSyD2cbxnI7kwzkrCjU3XedKcQo_B7ViBd64")

# Load the model once (global)
model = genai.GenerativeModel("gemini-2.5-pro")

def generate_recipe_from_image(image_path):
    prompt = """
    You are a recipe generator AI.

    1. If the uploaded image does NOT clearly show food, respond with EXACTLY:
    {
      "error": "Not a food image."
    }

    2. If the uploaded image DOES show food, analyze it and respond ONLY in **valid JSON** with the following structure:
    {
      "title": "string",
      "ingredients": ["item 1", "item 2"],
      "steps": ["step 1", "step 2"],
      "nutrition": {
        "calories": "string",
        "protein": "string",
        "carbs": "string",
        "fat": "string"
      },
      "cook_time": "string",    // e.g., "80 minutes"
      "servings": "string",     // e.g., "4 servings"
      "difficulty": "string"    // e.g., "Easy", "Medium", "Hard"
    }

    Do not include explanations, only valid JSON.
    """

    with open(image_path, "rb") as img_file:
        image_data = {
            "mime_type": "image/jpeg",  # adjust if needed
            "data": img_file.read()
        }

    response = model.generate_content([prompt, image_data])

    raw_text = response.text

    # ✅ Strip markdown fences if present
    if "```" in raw_text:
        raw_text = raw_text.split("```")[1]  # take the middle section
        raw_text = raw_text.replace("json", "", 1).strip()

    try:
        recipe_json = json.loads(raw_text)
    except Exception as e:
        recipe_json = {
            "title": f"Error parsing recipe: {str(e)}",
            "ingredients": [],
            "steps": [],
            "nutrition": {
                "calories": "",
                "protein": "",
                "carbs": "",
                "fat": ""
            },
            "cook_time": "",
            "servings": "",
            "difficulty": ""
        }

    return recipe_json

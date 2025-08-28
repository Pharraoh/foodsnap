# recipes/views.py
from django.shortcuts import render
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .services.ai import generate_recipe_from_image

def ind(request):
    return render(request, "recipes/index.html")

def ind2(request):
    return render(request, "recipes/index3.html")

def ind3(request):
    return render(request, "recipes/result2.html")

def upload_food_image(request):
    if request.method == "POST" and request.FILES.get("food_image"):
        uploaded_file = request.FILES["food_image"]

        # Save file
        file_path = default_storage.save(uploaded_file.name, ContentFile(uploaded_file.read()))
        full_path = default_storage.path(file_path)

        # Get recipe JSON
        recipe = generate_recipe_from_image(full_path)

        return render(request, "recipes/result3.html", {"recipe": recipe})

    return render(request, "index.html")

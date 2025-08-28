from django.urls import path
from . import views

urlpatterns = [
    path("ind", views.ind, name="ind"),
    path("ind2", views.ind2, name="ind2"),
    path("ind3", views.ind3, name="ind3"),
    path("upload_food_image/", views.upload_food_image, name="upload_food_image"),
]

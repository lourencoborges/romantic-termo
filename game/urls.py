from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("api/sync/", views.sync_words, name="sync_words"),
    path("service-worker.js", views.service_worker, name="service_worker"),
]

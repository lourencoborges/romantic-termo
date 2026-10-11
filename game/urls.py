from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("api/partida/", views.game_state, name="game_state"),
    path("api/chute/", views.submit_guess, name="submit_guess"),
]

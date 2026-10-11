"""Page rendering and the small endpoint used to sync words to installed apps."""
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.http import require_GET

from .models import Word


def home(request):
    return render(request, "game/home.html")


@require_GET
def sync_words(request):
    """Download the active word bank so guesses can be checked offline."""
    words = Word.objects.filter(active=True).order_by("id").values("id", "word")
    response = JsonResponse({
        "start_date": settings.GAME_START_DATE,
        "timezone": settings.TIME_ZONE,
        "server_date": timezone.localdate().isoformat(),
        "words": list(words),
    })
    response["Cache-Control"] = "no-store"
    return response


@require_GET
def service_worker(request):
    """Serve the service worker from the site root so it can cache the app shell."""
    script = Path(__file__).resolve().parent.parent / "static" / "game" / "service-worker.js"
    response = HttpResponse(script.read_text(encoding="utf-8"), content_type="application/javascript")
    response["Service-Worker-Allowed"] = "/"
    response["Cache-Control"] = "no-cache"
    return response

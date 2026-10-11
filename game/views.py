import json
from datetime import date

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import Word, normalize_word

LEVEL_COUNTS = (1, 2, 4)
MAX_GUESSES = 6


def _today():
    return timezone.localdate()


def _daily_targets(today=None):
    """Reserve seven consecutive words per calendar day, in stable admin order."""
    today = today or _today()
    start = date.fromisoformat(settings.GAME_START_DATE)
    day_number = (today - start).days
    words = list(Word.objects.filter(active=True).order_by("id").values_list("word", flat=True))
    if day_number < 0:
        return day_number, words, []
    first = day_number * sum(LEVEL_COUNTS)
    return day_number, words, words[first:first + sum(LEVEL_COUNTS)]


def _new_state(today, targets):
    levels = []
    cursor = 0
    for count in LEVEL_COUNTS:
        answers = targets[cursor:cursor + count]
        cursor += count
        levels.append({"answers": [
            {"target": answer, "guesses": [], "solved": False, "failed": False}
            for answer in answers
        ]})
    return {"date": today.isoformat(), "levels": levels}


def _get_state(request):
    today = _today()
    day_number, words, todays_targets = _daily_targets(today)
    if day_number < 0:
        return {"status": "not_started", "start_date": settings.GAME_START_DATE}, []
    if len(todays_targets) < 7:
        return {"status": "empty" if len(words) < 7 else "finished", "available_words": len(words)}, []
    saved = request.session.get("game_state")
    if not saved or saved.get("date") != today.isoformat():
        saved = _new_state(today, todays_targets)
        request.session["game_state"] = saved
    return saved, todays_targets


def _public_state(saved, targets):
    if saved.get("status"):
        return saved
    levels = []
    finished_count = 0
    for level_index, level in enumerate(saved["levels"]):
        public_answers = []
        for answer in level["answers"]:
            is_done = answer["solved"] or answer["failed"]
            finished_count += int(is_done)
            public_answers.append({
                "length": 5,
                "guesses": answer["guesses"],
                "solved": answer["solved"],
                "failed": answer["failed"],
                "answer": answer["target"] if is_done else None,
            })
        levels.append({"number": level_index + 1, "answers": public_answers})
    complete = finished_count == 7
    return {"status": "complete" if complete else "playing", "date": saved["date"],
            "max_guesses": MAX_GUESSES, "levels": levels, "finished_answers": finished_count,
            "total_answers": 7}


def _feedback(guess, target):
    """Return Termo colors while accounting for repeated letters."""
    result = ["absent"] * 5
    remaining = list(target)
    for index, letter in enumerate(guess):
        if letter == target[index]:
            result[index] = "correct"
            remaining[index] = None
    for index, letter in enumerate(guess):
        if result[index] == "correct":
            continue
        if letter in remaining:
            result[index] = "present"
            remaining[remaining.index(letter)] = None
    return result


@ensure_csrf_cookie
def home(request):
    return render(request, "game/home.html")


@require_GET
def game_state(request):
    saved, targets = _get_state(request)
    return JsonResponse(_public_state(saved, targets))


@require_POST
def submit_guess(request):
    saved, targets = _get_state(request)
    if saved.get("status"):
        return JsonResponse({"error": "Este jogo ainda não começou ou as palavras acabaram."}, status=409)
    try:
        payload = json.loads(request.body)
        guess = normalize_word(payload.get("guess", ""))
        level_index = int(payload.get("level", -1))
    except (ValueError, TypeError, json.JSONDecodeError):
        return JsonResponse({"error": "Envie uma tentativa válida."}, status=400)
    if len(guess) != 5 or not guess.isalpha():
        return JsonResponse({"error": "Digite uma palavra de 5 letras."}, status=400)
    if level_index not in range(3):
        return JsonResponse({"error": "Essa etapa não existe."}, status=400)
    current_level = next((index for index, level in enumerate(saved["levels"])
                          if not all(a["solved"] or a["failed"] for a in level["answers"])), 3)
    if level_index != current_level:
        return JsonResponse({"error": "Conclua a etapa atual antes de seguir."}, status=409)
    # Dueto and quarteto use the same submitted word on every board, like Termo.
    for answer in saved["levels"][level_index]["answers"]:
        if answer["solved"] or answer["failed"]:
            continue
        feedback = _feedback(guess, answer["target"])
        answer["guesses"].append({"word": guess, "feedback": feedback})
        if guess == answer["target"]:
            answer["solved"] = True
        elif len(answer["guesses"]) >= MAX_GUESSES:
            answer["failed"] = True
    request.session["game_state"] = saved
    return JsonResponse({"state": _public_state(saved, targets)})

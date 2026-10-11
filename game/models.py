import unicodedata

from django.core.exceptions import ValidationError
from django.db import models


def normalize_word(value):
    """Keep letters only and remove accents so guesses compare consistently."""
    value = unicodedata.normalize("NFD", value.strip().upper())
    return "".join(char for char in value if char.isalpha() and unicodedata.category(char) != "Mn")


class Word(models.Model):
    word = models.CharField("palavra", max_length=5, unique=True)
    note = models.CharField("lembrete pessoal (opcional)", max_length=140, blank=True)
    active = models.BooleanField("usar no jogo", default=True)
    created_at = models.DateTimeField("adicionada em", auto_now_add=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "palavra"
        verbose_name_plural = "palavras"

    def clean(self):
        self.word = normalize_word(self.word)
        if len(self.word) != 5:
            raise ValidationError({"word": "A palavra precisa ter exatamente 5 letras (sem contar acentos)."})
        if not self.word.isalpha():
            raise ValidationError({"word": "Use apenas letras."})

    def save(self, *args, **kwargs):
        self.word = normalize_word(self.word)
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.word

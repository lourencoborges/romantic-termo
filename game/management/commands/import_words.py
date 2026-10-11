import csv

from django.core.management.base import BaseCommand, CommandError

from game.models import Word


class Command(BaseCommand):
    help = "Importa palavras de um CSV com uma palavra por linha (ou coluna chamada word)."

    def add_arguments(self, parser):
        parser.add_argument("arquivo", help="Caminho do CSV, em UTF-8")

    def handle(self, *args, **options):
        try:
            with open(options["arquivo"], encoding="utf-8-sig", newline="") as file:
                rows = list(csv.reader(file))
        except OSError as error:
            raise CommandError(f"Não foi possível abrir o arquivo: {error}") from error
        if not rows:
            raise CommandError("O CSV está vazio.")
        if rows[0] and rows[0][0].strip().lower() in {"word", "palavra"}:
            rows = rows[1:]
        added = 0
        for row in rows:
            if not row or not row[0].strip():
                continue
            word = row[0].strip()
            note = row[1].strip() if len(row) > 1 else ""
            item, created = Word.objects.get_or_create(word=word.upper(), defaults={"note": note})
            if created:
                added += 1
        self.stdout.write(self.style.SUCCESS(f"Importação concluída: {added} palavra(s) nova(s)."))

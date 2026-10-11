from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [migrations.CreateModel(
        name="Word",
        fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("word", models.CharField(max_length=5, unique=True, verbose_name="palavra")),
            ("note", models.CharField(blank=True, max_length=140, verbose_name="lembrete pessoal (opcional)")),
            ("active", models.BooleanField(default=True, verbose_name="usar no jogo")),
            ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="adicionada em")),
        ],
        options={"verbose_name": "palavra", "verbose_name_plural": "palavras", "ordering": ["id"]},
    )]

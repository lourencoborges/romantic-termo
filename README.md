# Palavras que me lembram você

Um jogo diário de palavras feito em Django, inspirado no formato de adivinhar letras do Termo. O projeto começa com a lista vazia: as respostas pessoais devem ser adicionadas por você pelo painel ou importadas de um CSV.

## Como o jogo funciona

- Cada resposta tem **5 letras**. Acentos são aceitos e removidos para comparar (por exemplo, `CAFÉ` vira `CAFE`).
- Um desafio diário usa sete palavras da lista: 1 na etapa 1 (Termo), 2 na etapa 2 (Dueto) e 4 na etapa 3 (Quarteto). As mesmas tentativas são aplicadas a todos os tabuleiros abertos daquela etapa, como no Termo.
- Cada palavra tem até seis tentativas. Verde indica letra e posição corretas; amarelo indica letra existente em outra posição; cinza indica letra ausente.
- Você pode digitar no teclado do computador ou tocar nas teclas virtuais na tela.
- As palavras são distribuídas em ordem de cadastro, em blocos de sete por dia. Com 300 palavras, há 42 desafios completos; as três palavras restantes não formam um dia completo.
- O desafio muda à meia-noite no fuso `America/Sao_Paulo`. O progresso do dia fica na sessão do navegador. Não é necessário criar conta.
- Uma palavra só aparece como resposta depois de resolvida ou de acabarem as tentativas.

## Preparar no computador

Requer Python 3.10 ou mais recente.

```sh
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Abra <http://127.0.0.1:8000/> para jogar e <http://127.0.0.1:8000/admin/> para administrar as palavras.

## Colocar as palavras pessoais

No admin, entre em **Palavras**, adicione uma resposta por vez e escreva uma nota pessoal opcional. Deixe **Usar no jogo** marcado. A lista começa vazia, então é necessário cadastrar pelo menos sete palavras para liberar o primeiro desafio.

Para carregar várias de uma vez, crie um CSV UTF-8 com uma palavra na primeira coluna e, opcionalmente, uma lembrança na segunda:

```csv
palavra,lembrete
ABRACO,nosso primeiro abraço
BEIJO,a despedida na estação
RISOS,aquela viagem
```

Importe com:

```sh
python manage.py import_words palavras.csv
```

Palavras repetidas são ignoradas. A validação exige cinco letras; pontuação não é aceita. Após iniciar os desafios, evite reordenar ou desativar palavras antigas, porque isso pode mudar as respostas dos dias seguintes.

## Configurações úteis

O primeiro desafio está configurado para **11 de outubro de 2026**. Para escolher outra data, defina `GAME_START_DATE` no formato `AAAA-MM-DD` antes de iniciar o servidor. Também é possível definir `DJANGO_SECRET_KEY`, `DJANGO_DEBUG` e `DJANGO_ALLOWED_HOSTS` como variáveis de ambiente.

Exemplo no Linux/macOS:

```sh
GAME_START_DATE=2026-11-01 python manage.py runserver
```

## Organização do código

```text
romantic_game/       Configurações e URLs principais do Django
game/models.py       Cadastro e validação das palavras-resposta
game/admin.py        Edição da lista no painel /admin
game/views.py        Desafios diários, progresso e validação das tentativas
game/urls.py         Rotas da página e da API do jogo
game/management/     Comando para importar CSV
templates/game/      Estrutura HTML da página
static/game/         Estilos e interação no navegador
```

## Publicar na internet

Para compartilhar com ela, hospede o projeto em um serviço compatível com Django. Antes de publicar, defina uma chave secreta própria, `DJANGO_DEBUG=0` e os hosts autorizados em `DJANGO_ALLOWED_HOSTS`; execute `python manage.py migrate` e `python manage.py collectstatic`. Mantenha o banco SQLite em armazenamento persistente ou configure um banco gerenciado, e proteja o endereço `/admin/` com uma senha forte.

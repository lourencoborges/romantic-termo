# Palavras de Amor

Jogo diário inspirado no Termo, com a lista pessoal de palavras administrada em Django. A interface é uma PWA: depois de aberta com internet e sincronizada, pode ser instalada e usada sem conexão.

## Como funciona

- Cada resposta tem **5 letras**. Acentos são removidos para a comparação (`CAFÉ` vira `CAFE`).
- O desafio usa sete palavras por dia: 1 no Termo, 2 no Dueto e 4 no Quarteto. A mesma tentativa vale para todos os tabuleiros abertos da etapa.
- Cada palavra tem até seis tentativas. Verde indica letra e posição corretas; amarelo indica letra existente em outra posição; cinza indica letra ausente.
- O app baixa a lista de palavras ativas ao abrir quando há internet, tenta sincronizar quando a conexão volta e verifica atualizações enquanto fica aberto. A lista e o progresso diário são guardados no `localStorage` do aparelho; o service worker guarda a página e os arquivos do app.
- O jogo usa o fuso `America/Sao_Paulo`. O desafio do dia é calculado pela data, então pode continuar sem conexão enquanto houver palavras baixadas para os dias seguintes.
- Com 300 palavras há 42 desafios completos; as seis palavras restantes não completam outro dia. Para continuar, cadastre mais palavras e abra o app conectado para sincronizar.
- As respostas ficam no aparelho para permitir o jogo offline. Uma pessoa com conhecimento técnico e acesso ao armazenamento do navegador pode encontrá-las. O progresso é local e não sincroniza entre aparelhos; apagar os dados do navegador também apaga o progresso e a cópia da lista.

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

Abra <http://127.0.0.1:8000/> para jogar e <http://127.0.0.1:8000/admin/> para administrar a lista. `localhost` é aceito pelo navegador para testar o service worker. Para instalar em aparelhos e usar offline, o site publicado precisa usar HTTPS.

## Instalar no celular ou desktop

1. Abra o site com internet ao menos uma vez e espere o indicador mostrar `ONLINE`.
2. No Chrome/Edge, use **Instalar** quando o botão aparecer ou escolha a opção de instalar no menu do navegador. No iPhone/iPad, use **Compartilhar → Adicionar à Tela de Início** no Safari.
3. Abra o app instalado enquanto estiver online para baixar a lista. Depois disso, os desafios e o progresso ficam disponíveis sem internet.
4. Quando você adicionar palavras no admin, abra o app novamente com internet (Wi-Fi ou outra conexão) para atualizar a cópia local.

A instalação como PWA funciona em celular e desktop. Ela não cria por si só um arquivo APK; o APK Android pode ser empacotado depois usando a mesma versão web.

## Adicionar as palavras pessoais

No admin, entre em **Palavras**, adicione uma resposta por vez e escreva uma nota pessoal opcional. Deixe **Usar no jogo** marcado. A lista começa vazia; cadastre pelo menos sete palavras para liberar o primeiro desafio.

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

Palavras repetidas são ignoradas. A validação exige cinco letras; pontuação não é aceita. Depois de começar a usar o jogo, cadastre palavras novas no fim da lista e evite desativar ou reordenar as antigas, porque isso pode alterar a sequência dos desafios futuros.

## Data do primeiro desafio

O padrão é **11 de outubro de 2026**. Para escolher outra data, defina `GAME_START_DATE` no formato `AAAA-MM-DD` no servidor Django. Exemplo:

```sh
GAME_START_DATE=2026-11-01 python manage.py runserver
```

O app recebe essa configuração junto com a lista de palavras e a conserva no aparelho para calcular o desafio offline.

## Organização do código

```text
romantic_game/       Configurações e URLs do Django
game/models.py       Cadastro e validação das palavras
game/admin.py        Edição da lista em /admin
game/views.py        Página, sincronização da lista e service worker
game/urls.py         Rotas Django
game/management/     Importação da lista CSV
templates/game/      Estrutura HTML da PWA
static/game/game.js  Regras locais, teclado e progresso offline
static/game/style.css Estilos da interface
static/game/service-worker.js Cache dos arquivos para abrir sem internet
static/game/manifest.webmanifest Nome, ícones e modo de instalação
```

## Publicar no Vercel

O projeto já está configurado para o Vercel detectar o Django e servir os arquivos estáticos. O que ainda depende da sua conta são o banco PostgreSQL, as variáveis secretas, o primeiro deploy e o preenchimento da lista. O Vercel documenta suporte automático a Django e serve os estáticos pela CDN ([guia oficial](https://vercel.com/changelog/zero-configuration-django-support)).

1. Envie o projeto para um repositório Git e importe-o no Vercel.
2. Crie/conecte um PostgreSQL pelo Marketplace do Vercel, por exemplo Neon. A integração fornece `DATABASE_URL`; o projeto usa esse endereço para trocar o SQLite local pelo PostgreSQL persistente ([armazenamento no Vercel](https://vercel.com/docs/marketplace-storage)).
3. Em **Settings → Environment Variables**, configure para Production:
   - `DJANGO_SECRET_KEY`: uma chave secreta forte e aleatória. Gere uma com `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` e guarde-a somente nas variáveis do Vercel.
   - `DJANGO_DEBUG`: `0`.
   - `GAME_START_DATE`: a data do primeiro desafio (`AAAA-MM-DD`).
   - `DJANGO_ALLOWED_HOSTS`: opcional para o domínio `*.vercel.app`; defina o domínio próprio se usar um.
   - `DJANGO_CSRF_TRUSTED_ORIGINS`: opcional; para domínio próprio, use a origem completa, por exemplo `https://jogo.seudominio.com`.
   - `DATABASE_URL`: normalmente é criada pela integração PostgreSQL. Confirme que o nome da variável é exatamente este.
4. Faça o deploy. O Vercel reconhece o `manage.py`; não é necessário criar `vercel.json` para o roteamento Django.
5. Execute uma vez `python manage.py migrate` apontando para o `DATABASE_URL` de Production. Depois crie o usuário administrador com `python manage.py createsuperuser`, também conectado ao banco de Production. Não coloque a senha do banco nem a `DJANGO_SECRET_KEY` no repositório.
6. Abra `/admin/`, cadastre ou importe as palavras, e abra o app publicado conectado à internet. Ele baixa a lista e depois pode jogar offline.

Se o Vercel detectar `VERCEL=1` e não encontrar `DATABASE_URL` ou `DJANGO_SECRET_KEY`, o app agora para com uma mensagem clara em vez de iniciar com SQLite temporário ou chave de desenvolvimento. Localmente, sem `DATABASE_URL`, continua usando `db.sqlite3`.

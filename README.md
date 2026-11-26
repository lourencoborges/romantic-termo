# Palavras de Amor

Um jogo diário de palavras, feito para jogar no navegador do computador ou do celular. O projeto é um site estático: não usa Django, banco de dados, conta ou instalação para jogar.

## Jogar no computador

Com Python instalado, rode um servidor local simples:

```sh
python -m http.server 8000
```

Acesse <http://localhost:8000/>. O jogo funciona sem dependências externas.

## Como funciona

- O desafio diário tem três etapas: Termo (1 palavra), Dueto (2) e Quarteto (4).
- Cada palpite tem cinco letras e vale para todos os tabuleiros ainda abertos da etapa. Você tem seis tentativas.
- Verde indica letra e posição corretas; amarelo indica uma letra presente em outro lugar; cinza indica letra ausente.
- Os acentos são aceitos no teclado do aparelho e removidos para comparar as respostas.
- O progresso fica salvo no navegador. Depois de abrir o site uma vez, o service worker guarda os arquivos para o jogo também abrir offline.
- O desafio e a data seguem o fuso `America/Sao_Paulo`. Acertar a palavra do Termo revela um bilhetinho carinhoso.
- Para desenvolvedores, `?dev=1` mostra um botão que reinicia o progresso de hoje sem mudar as palavras.

## Publicar na web

Conecte o repositório ao Vercel e mantenha o **Root Directory** na raiz. Não configure build command, Django, Python ou banco de dados: o Vercel publica diretamente os arquivos do site. Qualquer hospedagem de arquivos estáticos também funciona.

A instalação PWA é opcional. Um APK poderá ser empacotado depois a partir desta versão web.

## Arquivos

```text
index.html           Estrutura da página
style.css            Visual responsivo para desktop e celular
app.js               Regras, desafios diários e progresso local
service-worker.js    Cache offline
manifest.webmanifest Metadados da instalação PWA
icon.svg             Ícone do jogo
```

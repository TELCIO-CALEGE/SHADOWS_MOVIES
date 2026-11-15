# SHADOWS_MOVIES

Aplicação web de descoberta de filmes do Studio Ghibli, desenvolvida com Vue 3, Vue Router e Vite para a disciplina de Programação Web II.

## Funcionalidades

- Página inicial com destaque cinematográfico.
- Catálogo de filmes do Studio Ghibli.
- Pesquisa por título.
- Filtros por realizador, ano e classificação.
- Ordenação por data, classificação e título.
- Paginação dos resultados.
- Página de detalhes e sugestões de filmes relacionados.
- Interface responsiva e tratamento de erros.

## API

A aplicação utiliza a [Studio Ghibli API](https://ghibliapi.vercel.app/films), uma API pública que não exige chave de acesso.

## Executar localmente

Requisitos: Node.js 22.18 ou superior (ou uma versão 24.12 ou superior).

```bash
npm ci
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Publicação

O projecto está preparado para publicação através do GitHub Actions e GitHub Pages.

URL prevista: https://telcio-calege.github.io/SHADOWS_MOVIES/

Em **Settings → Pages**, seleccionar **GitHub Actions** como origem de publicação, caso ainda não esteja configurada.

## Branches

- `main`: versão estável e publicada.
- `desenvolvimento`: trabalho e melhorias em desenvolvimento.

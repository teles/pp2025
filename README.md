# Passaporte Pinheiros - Site de Experiências

Este projeto é o front-end do **Passaporte Pinheiros**: um site para selecionar, explorar e visualizar as experiências disponíveis nos estabelecimentos participantes.

## O que o site faz

- Lista os lugares participantes em formato de cards.
- Permite filtrar por tipo de culinária e tipo de benefício.
- Exibe detalhes da experiência de cada estabelecimento.
- Mostra galeria de imagens (logo + fotos).
- Exibe localização no mapa e link para abrir no Google Maps.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Leaflet (mapa)
- Papa Parse (leitura de CSV)

## Dados e assets

Os dados são lidos de:

- `public/data/data.csv`

As imagens seguem o padrão:

- `public/images/{slug}/logo.jpg`
- `public/images/{slug}/foto-1.jpg`
- `public/images/{slug}/foto-2.jpg`
- `public/images/{slug}/foto-3.jpg`
- `public/images/{slug}/{slug}.jpg`

Observação: o `slug` usado no CSV deve existir também em `src/lib/constants.ts` para manter o mapeamento de coordenadas.

## Rodando localmente

Pré-requisito:

- Node.js `20.19+` (ou `22.12+`)

Comandos:

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Deploy no GitHub Pages

O deploy está configurado por GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push na branch `main`
- Publicação: pasta `dist`

Para ativar no GitHub:

1. Abra `Settings` > `Pages`.
2. Em `Build and deployment`, selecione `GitHub Actions`.
3. Faça push na `main`.
4. Aguarde o workflow `Deploy to GitHub Pages` finalizar.

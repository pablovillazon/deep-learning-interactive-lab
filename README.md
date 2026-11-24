# Deep Learning Interactive Lab

**Versión 0.1.0** — plataforma educativa en español para comprender Deep Learning mediante modelos matemáticos, diagramas y simulaciones interactivas desde el navegador.

## Laboratorios incluidos

- **Clase 1 — Funciones de activación:** ReLU, Leaky ReLU, sigmoide y tanh. Comparaciones y evaluación de entrada/salida.
- **Clase 2 — Red shallow:** predicción didáctica de consumo eléctrico de una vivienda, función por tramos con activaciones ReLU.
- **Clase 2 — Red deep:** indicador ilustrativo de riesgo de inundación mediante una arquitectura 2–3–2–1.

> **Alcance:** los modelos se configuraron manualmente para enseñar propagación hacia delante. No utilizan datos reales ni entrenamiento. En particular, el índice de inundación **no es una probabilidad** y **no es apto para decisiones de ingeniería**.

## Requisitos

Node.js **20.19+** (recomendado Node.js 22) y npm.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL local indicada por Vite (habitualmente `http://localhost:5173/`).

## Pruebas y compilación

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

El sitio de producción se guarda en `dist/`. El repositorio inicial se entrega **sin `package-lock.json`**, ya que el entorno de preparación no tenía acceso a los paquetes del registro; después de `npm install`, confirma ese archivo para habilitar `npm ci` y builds reproducibles.

## Publicación en GitHub Pages

1. En **Settings → Pages**, selecciona **Build and deployment → GitHub Actions**.
2. Integra los cambios en `main`; el workflow `Deploy GitHub Pages` compila y publica el sitio.
3. URL prevista una vez activado el despliegue: `https://pablovillazon.github.io/deep-learning-interactive-lab/`.

Vite utiliza automáticamente `base: '/deep-learning-interactive-lab/'` cuando `GITHUB_PAGES=true`.

## Estructura

```text
src/core/           Funciones matemáticas puras
src/components/     Gráficos, controles y diagramas
src/modules/        Laboratorios agrupados por clase
tests/              Verificación de cálculos numéricos
docs/               Arquitectura y plan de ampliación
.github/workflows/  CI y GitHub Pages
```

## Referencias

Simon J. D. Prince, *Understanding Deep Learning* (MIT Press). Sitio del libro: https://udlbook.github.io/udlbook/ . Recurso docente complementario e independiente; **no es un producto oficial ni afiliado al autor**.

## Licencia

MIT, para el código original de esta plataforma (ver `LICENSE`). Los recursos externos conservan sus propias licencias.

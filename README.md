# Deep Learning Interactive Lab

**Versión 0.1.1** — plataforma educativa en español para comprender Deep Learning mediante modelos matemáticos, diagramas y simulaciones interactivas desde el navegador.

## Laboratorios incluidos

- **Clase 1 — Funciones de activación:** ReLU, Leaky ReLU, sigmoide y tanh. Comparaciones y evaluación de entrada/salida.
- **Clase 2 — Red shallow:** predicción didáctica de consumo eléctrico de una vivienda, función por tramos con activaciones ReLU.
- **Clase 2 — Red deep:** indicador ilustrativo de riesgo de inundación mediante una arquitectura 2–3–2–1.

> **Alcance:** los modelos se configuraron manualmente para enseñar propagación hacia delante. No utilizan datos reales ni entrenamiento. En particular, el índice de inundación **no es una probabilidad** y **no es apto para decisiones de ingeniería**.

## Ruta pedagógica en los laboratorios de redes neuronales

Cada laboratorio de la Clase 2 incluye ocho apartados, en este orden:

1. Planteamiento del problema real y definición de las variables.
2. Arquitectura propuesta y conteo de parámetros.
3. Fundamentación matemática y significado de pesos, sesgos y activaciones.
4. Ejemplo numérico completamente resuelto con parámetros originales.
5. Simulador interactivo para experimentar.
6. Propagación hacia delante y parámetros ajustables.
7. Interpretación de cambios, comparaciones y preguntas de reflexión.
8. Práctica libre y código equivalente en Python.

Los ejemplos resueltos conservan los parámetros iniciales para que puedan reproducirse de forma estable, mientras que las secciones de interpretación comparan los ajustes actuales.

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

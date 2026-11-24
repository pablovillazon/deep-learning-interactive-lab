# Arquitectura v0.1.0

## Capas

1. **Núcleo numérico (`src/core`)**: funciones puras de activación, capa densa y propagación. No dependen de React.
2. **Modelos didácticos (`src/modules/.../models.ts`)**: definen arquitecturas y conjuntos de parámetros iniciales. El simulador deep expone los 20 parámetros.
3. **Componentes reutilizables (`src/components`)**: rangos deslizantes, diagramas SVG, trazado de curvas y ecuaciones KaTeX.
4. **Laboratorios (`src/modules`)**: experiencias pedagógicas, ejemplos numéricos, código Python y cuestiones para estudiantes.
5. **Interfaz (`src/App.tsx`)**: navegación local por estados, adecuada para despliegue estático.

## Precisión académica

La red deep implementa `W₁(3×2)`, `b₁(3)`, `W₂(2×3)`, `b₂(2)`, `W₃(1×2)`, `b₃(1)`: total 20 parámetros. La red shallow usa `W₁(2×1)`, `b₁(2)`, `W₂(1×2)`, `b₂(1)`: exactamente 7 parámetros, todos ajustables de forma independiente.

## CI/CD

CI valida tipos, pruebas y compilación. GitHub Pages publica desde `main` mediante Actions con una base URL explícita. Recomendada incorporación posterior de `package-lock.json`.

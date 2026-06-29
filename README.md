# 🔢 Clasificador de Dígitos Manuscritos

> Red Neuronal Convolucional (CNN) que reconoce números escritos a mano en tiempo real, directamente en el navegador.

[![Demo en Vivo](https://img.shields.io/badge/Netlify-Deployed-success?logo=netlify)](https://digit-classifier-test.netlify.app/)
[![GitHub](https://img.shields.io/badge/Código-GitHub-blue?logo=github)](https://github.com/FernandoRodriguezValdivia/digit-classifier)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=github-actions)](https://github.com/FernandoRodriguezValdivia/digit-classifier/actions)

---

## 🎯 ¿Qué hace?

Dibuja un dígito (0-9) en el canvas y una **red neuronal convolucional (CNN)** entrenada con el dataset **MNIST** predecirá el número en tiempo real, mostrando el nivel de confianza.

**Todo corre 100% en el navegador. No hay backend. No se envían datos a ningún servidor.**

---

## 🚀 Demo en vivo

Puedes probar la aplicación aquí: **[https://digit-classifier-test.netlify.app/](https://digit-classifier-test.netlify.app/)**

---

## ✨ Características

- 🎨 **Dibujo interactivo** en canvas con soporte para mouse y touch.
- 🧠 **Predicción en tiempo real** usando TensorFlow.js con WebGL.
- 📱 **Diseño responsivo** para dispositivos móviles.

---

## 🛠️ Tecnologías utilizadas

| Área | Tecnologías |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Machine Learning** | TensorFlow.js (WebGL backend) |
| **CI/CD** | GitHub Actions + Netlify |
| **Control de versiones** | Git + GitHub |

---

## 🚀 CI/CD Pipeline
El proyecto utiliza un pipeline automatizado con GitHub Actions y Netlify:
| Evento | Acción |
| :--- | :--- |
| `push` a `main` | Construye el proyecto y despliega en producción. |
| `pull_request` hacia `main` | Despliega un preview automático para probar los cambios sin afectar producción. |

Esto garantiza que el código siempre esté en un estado desplegable y que los cambios sean probados antes de llegar a producción.

---

## 📦 Instalación y uso local

### Prerrequisitos
- Node.js v20 o superior.
- npm o yarn

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/FernandoRodriguezValdivia/digit-classifier
cd digit-classifier

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir http://localhost:5173 en tu navegador
```

### Comandos disponibles
```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera el build para producción
npm run preview  # Previsualiza el build localmente
```

---
## 👤 Autor
Fernando Rodriguez Valdivia

- LinkedIn: [linkedin.com/in/fernando-rodriguez-valdivia](https://www.linkedin.com/in/fernando-rodriguez-valdivia/)
- Correo: frodvaldivia@gmail.com
- GitHub: [github.com/FernandoRodriguezValdivia](https://github.com/FernandoRodriguezValdivia)
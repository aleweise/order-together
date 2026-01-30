# OrderTogether 🍕

Aplicación web para coordinar pedidos grupales de comida de forma sencilla y rápida.

## Características

- 🎯 **Crear Sesión**: Genera un código único para invitar amigos.
- 🔗 **Unirse**: Tus amigos se unen con el código.
- 🍔 **Elegir Platos**: Menú interactivo (actualmente McDonald's).
- 💰 **Resumen**: Totales calculados automáticamente por persona.
- 📱 **Mobile First**: Diseño optimizado para celulares.

## Tecnologías

- React + Vite
- Tailwind CSS v4
- Firebase Firestore (Base de datos en tiempo real)
- React Router DOM
- Lucide React (Iconos)

## Instrucciones de Instalación

1. **Entrar a la carpeta del proyecto**

    ```bash
    cd order-together
    ```

2. **Instalar dependencias**

    ```bash
    npm install
    ```

3. **Configurar Firebase**
    - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
    - Habilita **Cloud Firestore** (crear base de datos).
    - Registra una app web y copia la configuración (`apiKey`, `projectId`, etc.).
    - Abre el archivo `src/firebase/config.js` y pega tus credenciales.

4. **Ejecutar el proyecto**

    ```bash
    npm run dev
    ```

## Estructura del Proyecto

- `src/components`: Componentes reutilizables (Botones, Header, Items).
- `src/pages`: Vistas principales (Inicio, Crear, Unirse, Menú, Resumen).
- `src/context`: Manejo del estado global de la sesión.
- `src/firebase`: Lógica de conexión con Firestore.
- `src/data`: Datos mock (menú).

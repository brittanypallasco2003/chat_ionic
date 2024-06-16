# Chat Ionic (Chat Esfot) 📨

Aplicación móvil de chat.
Envía fotos y pdf a tus amigos 🥳

#### APK: Descarga el [.apk](src/assets/app-debug.apk)

#### Web: [Página web Chat Esfot](https://chat-f4e72.web.app/)

#### Video del funcionamiento: 

## Autores

- Brittany Espinel - [@brittanypallasco2003](https://github.com/brittanypallasco2003)

## Cómo correr el proyecto

Instala ionic

```bash
  npm i -g @ionic/cli
```

Clona este repositorio

```bash
  git clone https://github.com/brittanypallasco2003/chat_ionic.git
```

Instala los paquetes

```bash
  npm i
```

Correlo en la web

```bash
  ionic serve
```

## Despliegue en Android 📱

Construye con la splash screen

|Extensión VSCode: instala la extensión de Ionic, ve a Configuration, Splash Screen & Icon y reconstruye|
|-|
|![image](https://github.com/brittanypallasco2003/chat_ionic/assets/117743650/d21ea3fd-cfc7-49be-8d7b-7c862b435173)|

o usa el comando:

```bash
  npx @capacitor/assets generate --android
```

Construye con Android Studio

```bash
  ionic capacitor build android
```

## Variables de Entorno ⚙️

Para ejecutar este proyecto necesitaras dirijirte a archivo .env y colocar tus variables de entorno de la siguiente manera:

```js
firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
```

## Firbase

### Storage

### Firestore
### Authentication



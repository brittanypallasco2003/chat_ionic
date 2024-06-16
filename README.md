# Chat Ionic (Chat Esfot) 📨

Aplicación móvil de chat.
Envía fotos y pdf a tus amigos 🥳

#### APK: Descarga la [.apk](src/assets/app-debug.apk)

#### Web: [Página web Chat Esfot](https://chat-f4e72.web.app/)

#### Video del funcionamiento: [Chat Ionic - Funcionamiento](https://youtu.be/VChBe8QhDBU) 

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

Para ejecutar este proyecto necesitaras dirijirte a archivo **environment.ts** y colocar tus variables de entorno de la siguiente manera:

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
|Authentication|
|-|
|![image](https://github.com/brittanypallasco2003/chat_ionic/assets/117743650/d4e6c991-e090-4bd3-8afe-c15db64f4931)|

|Storage|
|-|
|![image](https://github.com/brittanypallasco2003/chat_ionic/assets/117743650/3640d5b4-390c-437d-a0f7-83fb680e07b7)|

|Cloud Firestore|
|-|
|![image](https://github.com/brittanypallasco2003/chat_ionic/assets/117743650/ea6e48ed-46d4-4213-be29-a5f1f2e7875c)|



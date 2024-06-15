import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCZquDoStDQn3FoS0onRshn4EizxspW6Xk',
      authDomain: 'chat-f4e72.firebaseapp.com',
      projectId: 'chat-f4e72',
      storageBucket: 'chat-f4e72.appspot.com',
      messagingSenderId: '862288524497',
      appId: '1:862288524497:web:4393a248bf72dc7588c1f0',
      measurementId: 'G-Q9PSFLF64Q',
    }),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCZquDoStDQn3FoS0onRshn4EizxspW6Xk',
        authDomain: 'chat-f4e72.firebaseapp.com',
        projectId: 'chat-f4e72',
        storageBucket: 'chat-f4e72.appspot.com',
        messagingSenderId: '862288524497',
        appId: '1:862288524497:web:4393a248bf72dc7588c1f0',
        measurementId: 'G-Q9PSFLF64Q',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

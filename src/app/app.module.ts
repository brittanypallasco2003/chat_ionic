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
      apiKey: 'AIzaSyAwH7ERJBK12Q3zar5q-EHLUJl7Scmtw8g',
      authDomain: 'chatbot-ionic-5c561.firebaseapp.com',
      projectId: 'chatbot-ionic-5c561',
      storageBucket: 'chatbot-ionic-5c561.appspot.com',
      messagingSenderId: '347306621194',
      appId: '1:347306621194:web:ad87a033b91774578fa2f3',
      measurementId: 'G-FTG9LNTT80',
    }),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyAwH7ERJBK12Q3zar5q-EHLUJl7Scmtw8g',
        authDomain: 'chatbot-ionic-5c561.firebaseapp.com',
        projectId: 'chatbot-ionic-5c561',
        storageBucket: 'chatbot-ionic-5c561.appspot.com',
        messagingSenderId: '347306621194',
        appId: '1:347306621194:web:ad87a033b91774578fa2f3',
        measurementId: 'G-FTG9LNTT80',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

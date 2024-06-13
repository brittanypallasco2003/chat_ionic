import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { serverTimestamp } from 'firebase/firestore';
import 'firebase/compat/firestore';

import { FieldValue } from '@firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
}

export interface Message {
  createdAt: FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: User | null = null;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = { uid: user.uid, email: user.email };
      } else {
        this.currentUser = null;
      }
    });
  }

  async signup({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (credential.user) {
      const uid = credential.user.uid;

      return this.afs.doc(`users/${uid}`).set({
        uid,
        email: credential.user.email,
      });
    } else {
      throw new Error('Creación fallida de usuario');
    }
  }

  signIn({ email, password }: { email: string; password: string }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }


  async logInWithGoogleProvider(): Promise<void> {
    try {
      const result = await this.afAuth.signInWithPopup(new GoogleAuthProvider());

      if (result.user) {
        const uid = result.user.uid;
        const email = result.user.email;

        // Check if user exists in Firestore
        const userDoc = await this.afs.doc(`users/${uid}`).get().toPromise();

        // Check if userDoc is defined and handle the case when it doesn't exist
        if (userDoc && !userDoc.exists) {
          // If user does not exist, create a new record
          await this.afs.doc(`users/${uid}`).set({
            uid,
            email,
          });
        }
      }
    } catch (error) {
      alert(error);
    }
  }
  
  

  addChatMessage(msg: string) {
    if (this.currentUser && this.currentUser.uid) {
      return this.afs.collection('messages').add({
        msg: msg,
        from: this.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      throw new Error('No user is currently signed in');
    }
  }

  getChatMessages() {
    let users: any[] = [];
    return this.getUsers().pipe(
      switchMap((res) => {
        users = res;
        return this.afs
          .collection('messages', (ref) => ref.orderBy('createdAt'))
          .valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map((messages) => {
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          if (this.currentUser && this.currentUser.uid) {
            m.myMsg = this.currentUser.uid === m.from;
          }
        }
        return messages;
      })
    );
  }

  private getUsers() {
    return this.afs
      .collection('users')
      .valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  private getUserForMsg(msgFromId: string, users: User[]): string {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email ? usr.email : 'User';
      }
    }
    return 'User';
  }
}

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
  msg?: string;
  imageUrl?: string;
  pdfUrl?: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: User | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = { uid: user.uid, email: user.email };
      } else {
        this.currentUser = null;
      }
    });
  }

  async signup({ email, password }: { email: string; password: string; }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

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

  signIn({ email, password }: { email: string; password: string; }) {
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

        const userDoc = await this.afs.doc(`users/${uid}`).get().toPromise();

        if (userDoc && !userDoc.exists) {
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

  async addChatMessage(content: string, file?: File) {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    if (file) {
      const filePath = `chat_files/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      await task.then(async (snapshot) => {
        const fileUrl = await snapshot.ref.getDownloadURL();
        const isPdf = file.type === 'application/pdf';

        await this.afs.collection('messages').add({
          from: this.currentUser!.uid,
          createdAt: serverTimestamp(),
          fromName: this.currentUser!.email || '',
          myMsg: true,
          ...(isPdf ? { pdfUrl: fileUrl } : { imageUrl: fileUrl }),
        });
      });
    } else {
      await this.afs.collection('messages').add({
        msg: content,
        from: this.currentUser!.uid,
        createdAt: serverTimestamp(),
        fromName: this.currentUser!.email || '',
        myMsg: true,
      });
    }
  }

  getChatMessages(): Observable<Message[]> {
    let users: User[] = [];
    return this.getUsers().pipe(
      switchMap((res) => {
        users = res;
        return this.afs.collection('messages', (ref) => ref.orderBy('createdAt'))
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

  private getUsers(): Observable<User[]> {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
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

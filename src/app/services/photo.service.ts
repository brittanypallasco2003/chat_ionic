import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { }

  private async savePicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Cambia a Photos para seleccionar desde el sistema de archivos
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    const photoURL = await this.uploadPhoto(savedImageFile);
    return photoURL;
  }

  private async uploadPhoto(photo: UserPhoto) {
    const response = await fetch(photo.webviewPath!);
    const blob = await response.blob();
    const filePath = `photos/${photo.filepath}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, blob);

    return new Promise<string>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise();
          this.firestore.collection('photos').add({
            filepath: photo.filepath,
            webviewPath: downloadURL
          }).then(() => {
            resolve(downloadURL);
          }).catch(reject);
        })
      ).subscribe();
    });
  }

  public async loadSaved() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    for (let photo of this.photos) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    this.photos.splice(position, 1);
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });

    const filePath = `photos/${filename}`;
    const fileRef = this.storage.ref(filePath);
    fileRef.delete().subscribe(() => {
      this.firestore.collection('photos', ref => ref.where('filepath', '==', photo.filepath))
        .snapshotChanges()
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            snapshot.payload.doc.ref.delete();
          });
        });
    });
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  messages!: Observable<any[]>;
  newMsg = '';
  selectedImage: File | null = null;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage() {
    if (this.newMsg.trim() !== '' || this.selectedImage) {
      try {
        // Si hay una imagen seleccionada, envíala junto con el mensaje
        if (this.selectedImage) {
          this.chatService.addChatMessage(this.newMsg, this.selectedImage).then(() => {
            this.newMsg = '';
            this.selectedImage = null;
            this.content.scrollToBottom();
          }).catch(error => {
            console.error('Error sending message with image:', error);
          });
        } else {
          // Si no hay imagen, envía solo el mensaje de texto
          this.chatService.addChatMessage(this.newMsg).then(() => {
            this.newMsg = '';
            this.content.scrollToBottom();
          }).catch(error => {
            console.error('Error sending message:', error);
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
  }
}

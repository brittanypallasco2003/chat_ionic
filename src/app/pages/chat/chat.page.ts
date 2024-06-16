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
  selectedFile: File | null = null;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage() {
    if (this.newMsg.trim() !== '' || this.selectedFile) {
      try {
        if (this.selectedFile) {
          this.chatService.addChatMessage(this.newMsg, this.selectedFile).then(() => {
            this.newMsg = '';
            this.selectedFile = null;
            this.content.scrollToBottom();
          }).catch(error => {
            console.error('Error al enviar el mensaje con el archivo:', error);
          });
        } else {
          this.chatService.addChatMessage(this.newMsg).then(() => {
            this.newMsg = '';
            this.content.scrollToBottom();
          }).catch(error => {
            console.error('Error al enviar mensaje:', error);
          });
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    }
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }
}

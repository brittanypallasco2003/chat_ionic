import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
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

  constructor(
    private chatService: ChatService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  async sendMessage() {
    if (this.newMsg.trim() !== '' || this.selectedFile) {
      const loading = await this.loadingController.create({
        message: 'Enviando mensaje...',
      });
      await loading.present();

      try {
        if (this.selectedFile) {
          await this.chatService.addChatMessage(this.newMsg, this.selectedFile);
        } else {
          await this.chatService.addChatMessage(this.newMsg);
        }
        this.newMsg = '';
        this.selectedFile = null;
        await this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        loading.dismiss();
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

  async onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      const loading = await this.loadingController.create({
        message: 'Cargando archivo...',
      });
      await loading.present();

      try {
        this.selectedFile = file;
      } catch (error) {
        console.error('Error loading file:', error);
      } finally {
        loading.dismiss();
      }
    }
  }

  private async scrollToBottom() {
    try {
      await this.content.scrollToBottom(300);
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }
}

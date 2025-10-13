import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CashBoxWebsocketService {
  private stompClient!: Client;

  connect(onMessage: (message: any) => void) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl + '/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/stock-updates', (msg: IMessage) => {
        const body = JSON.parse(msg.body);
        onMessage(body);
      });
    };

    this.stompClient.activate();
  }

  disconnect() {
    this.stompClient?.deactivate();
  }
}

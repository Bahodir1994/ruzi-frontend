import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class Message {
  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {
  }

  success(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
    });
  }

  error(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
    });
  }

  custom(message: {
    severity: string;
    summary: string;
    detail: string;
    life?: number;
  }) {
    this.messageService.add({
      ...message,
      summary: this.translate.instant(message.summary),
      detail: this.translate.instant(message.detail),
    });
  }
}

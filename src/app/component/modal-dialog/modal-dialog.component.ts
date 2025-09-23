import {Component} from '@angular/core';
import {SharedModule} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Image} from 'primeng/image';

export interface ModalDialogData {
  messageDetail: string;
}

@Component({
  selector: 'app-modal-dialog',
  imports: [
    SharedModule,
    Image
  ],
  templateUrl: './modal-dialog.component.html',
  standalone: true,
  styleUrl: './modal-dialog.component.scss'
})
export class ModalDialogComponent {
  messageDetail: string = '';

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig // Используем DynamicDialogConfig для получения данных
  ) {
  }

  ngOnInit() {
    // Инициализируем messageDetail из переданных данных
    if (this.config.data && this.config.data.messageDetail) {
      this.messageDetail = this.config.data.messageDetail;
    }
  }

  close() {
    this.dialogRef.close();
  }
}

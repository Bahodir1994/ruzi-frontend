import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {ReceiptPrintService} from './receipt-print-service';

@Component({
  selector: 'app-payment-success-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './payment-success-dialog.html',
  styleUrl: './payment-success-dialog.scss'
})
export class PaymentSuccessDialog {

  @Input() visible = false;

  @Input() total = 0;
  @Input() paid = 0;
  @Input() change = 0;
  @Input() debt = 0;
  @Input() cartNumber?: string;

  @Output() newSale = new EventEmitter();
  @Output() printReceipt = new EventEmitter();

  constructor(private printer: ReceiptPrintService) {}

  onPrint() {
    const html = `
    <div class="center bold">Chek № ${this.cartNumber}</div>
    <hr>
    <table>
      <tr><td>Jami:</td><td style="text-align:right">${this.total.toFixed(2)}</td></tr>
      <tr><td>To'langan:</td><td style="text-align:right">${this.paid.toFixed(2)}</td></tr>
      ${this.change > 0 ? `<tr><td>Qaytim:</td><td style="text-align:right">${this.change.toFixed(2)}</td></tr>` : ''}
      ${this.debt > 0 ? `<tr><td>Qarz:</td><td style="text-align:right">${this.debt.toFixed(2)}</td></tr>` : ''}
    </table>
    <hr>
    <div class="center">Raxmat! 😊</div>
  `;

    this.printer.print(html);
    this.close()
  }

  close() {
    this.visible = false;
  }
}

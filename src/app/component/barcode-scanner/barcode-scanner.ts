import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  templateUrl: './barcode-scanner.html',
  styleUrl: './barcode-scanner.scss'
})
export class BarcodeScanner {

  @Output() scanned = new EventEmitter<string>();
  @Output() scannerStatus = new EventEmitter<boolean>(); // ACTIVE / INACTIVE status

  private buffer = "";
  private timer: any;

  scannerActive = false;
  scannerInactiveTimer: any;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {

    /** --- SCANNER ACTIVE LOGIC --- */
    this.scannerActive = true;
    this.scannerStatus.emit(true);

    clearTimeout(this.scannerInactiveTimer);
    this.scannerInactiveTimer = setTimeout(() => {
      this.scannerActive = false;
      this.scannerStatus.emit(false);
    }, 1500);

    /** --- BARCODE READING LOGIC --- */
    if (e.key.length === 1) {
      this.buffer += e.key;
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.buffer.length > 5) {
        this.scanned.emit(this.buffer);
      }
      this.buffer = "";
    }, 50);
  }
}

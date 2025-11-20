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

    const isScanner = this.isScannerEvent(e);

    // 1) Faqat SCANNER bo‘lsa inputlarni bloklaymiz!
    if (isScanner) {
      e.preventDefault();
      e.stopPropagation();
    }

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


// =============== SCANNER ANIQLASH FUNKSIYASI ===============
  private lastKeyTime = 0;

  private isScannerEvent(e: KeyboardEvent): boolean {
    const now = Date.now();
    const diff = now - this.lastKeyTime;
    this.lastKeyTime = now;

    // Scanner juda tez yozadi → klaviatura yozganidan farqli
    return diff < 30 && e.key.length === 1;
  }

}

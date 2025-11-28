import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReceiptPrintService {

  print(html: string) {
    const w = window.open('', '_blank');

    w!.document.write(`
      <html>
        <head>
          <style>
            @page { size: 80mm auto; margin: 5mm; }
            body { font-family: monospace; font-size: 12px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            table { width: 100%; }
            td { padding: 2px 0; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);

    w!.document.close();
    w!.focus();

    setTimeout(() => {
      w!.print();
      // print oynasi yopilishi uchun
      setTimeout(() => w!.close(), 200);
    }, 300);
  }
}

import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Scroller} from 'primeng/scroller';
import {CartsService} from './carts.service';
import {DatePipe, DecimalPipe, JsonPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-carts',
  imports: [
    Scroller,
    NgClass,
    DecimalPipe,
    DatePipe,
    JsonPipe
  ],
  templateUrl: './carts.html',
  standalone: true,
  styleUrl: './carts.scss'
})
export class Carts {
  items: any[] = []; // boshlanishda bo‘sh
  initialized = false; // 1-marta yuklanganimizni bilish uchun
  lazyLoading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private cartsService: CartsService
  ) {}

  onLazyLoad(event: any) {
    this.lazyLoading = true;

    let first = event.first;
    let rows = event.last - event.first;

    // ❗️PrimeNG birinchi chaqiruvda rows = 0 beradi — tuzatamiz
    if (rows === 0) {
      rows = 20; // yoki senga kerak bo‘lgan default page size
    }

    this.cartsService.get_carts(first, rows).subscribe({
      next: (page) => {

        console.log("BACKEND_RESPONSE:", page);

        if (!page || !page.content) {
          this.lazyLoading = false;
          return;
        }

        const content = page.content;
        const total = page.totalElements;

        // Birinchi yuklashda scroll height to‘g‘rilash
        if (!this.initialized) {
          this.items = Array(total).fill(null);
          this.initialized = true;
        }

        // Ma'lumotlarni joyiga qo'yamiz
        for (let i = 0; i < content.length; i++) {
          this.items[first + i] = content[i];
        }

        this.lazyLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


}

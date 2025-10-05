import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Splitter} from 'primeng/splitter';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgClass, NgForOf} from '@angular/common';
import {CarService} from '../../service/modules/cashbox/car-service';
import {Car} from '../../domain/car';
import {Toolbar} from 'primeng/toolbar';
import {InputText} from 'primeng/inputtext';
import {DataView} from 'primeng/dataview';
import {SelectButton} from 'primeng/selectbutton';
import {Tag} from 'primeng/tag';

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}


@Component({
  selector: 'app-cashbox',
  imports: [
    Splitter,
    Button,
    FormsModule,
    TableModule,
    Toolbar,
    InputText,
    RouterLink,
    NgForOf,
    DataView,
    SelectButton,
    NgClass,
    Tag,
    ButtonDirective,
    CurrencyPipe
  ],
  templateUrl: './cashbox.html',
  standalone: true,
  styleUrl: './cashbox.scss',
  providers: [CarService],
  encapsulation: ViewEncapsulation.None
})
export class Cashbox implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  layout: "list" | "grid" = "grid";

  products = signal<any>([]);

  options = ['list', 'grid'];


  constructor(private carService: CarService) {
  }

  ngOnInit() {
    this.carService.getProducts().then((data) => {
      this.products.set([...data.slice(0,12)]);
    });
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }
}

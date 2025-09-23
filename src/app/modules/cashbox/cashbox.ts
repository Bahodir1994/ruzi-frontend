import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Splitter} from 'primeng/splitter';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {NgForOf} from '@angular/common';
import {CarService} from '../../service/cashbox/car-service';
import {Car} from '../../domain/car';
import {Toolbar} from 'primeng/toolbar';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {SplitButton} from 'primeng/splitbutton';
import {InputText} from 'primeng/inputtext';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-cashbox',
  imports: [
    Splitter,
    Button,
    FormsModule,
    TableModule,
    NgForOf,
    Toolbar,
    IconField,
    InputIcon,
    SplitButton,
    InputText,
    RouterLink
  ],
  templateUrl: './cashbox.html',
  standalone: true,
  styleUrl: './cashbox.scss',
  providers: [CarService],
  encapsulation: ViewEncapsulation.None
})
export class Cashbox implements OnInit, AfterViewInit{
  @ViewChild('searchInput') searchInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }


  cars!: Car[];

  virtualCars!: Car[];

  cols!: Column[];

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];

    this.cars = Array.from({ length: 10000 }).map((_, i) => this.carService.generateCar(i + 1));
    this.virtualCars = Array.from({ length: 10000 });
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }
}

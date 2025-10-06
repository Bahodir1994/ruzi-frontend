import {
  AfterViewInit, ChangeDetectorRef,
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
import {CurrencyPipe, DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {CarService} from '../../service/modules/cashbox/car-service';
import {Car} from '../../domain/car';
import {Toolbar} from 'primeng/toolbar';
import {InputText} from 'primeng/inputtext';
import {DataView} from 'primeng/dataview';
import {SelectButton} from 'primeng/selectbutton';
import {Tag} from 'primeng/tag';
import {CashboxService} from './cashbox.service';
import {firstValueFrom} from 'rxjs';
import {UnitModel} from '../items/unit/unit-model';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {StockView} from './cashbox.model';
import {Tooltip} from 'primeng/tooltip';

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
    DecimalPipe,
    Tooltip
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

  layout: "grid" | "list" = "list";
  options = ['list', 'grid'];

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  stockView: StockView[] = [];
  dataTableInputProductModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 0, dir: 'desc'}],
    columns: [
      {data: 'quantity', name: 'quantity', searchable: false, orderable: false, search: {value: '', regex: false}},
      { data: 'purchaseOrderItem.item.name', name: 'purchaseOrderItem.item.name', searchable: true, orderable: false, search: {value: '', regex: false}},
      { data: 'purchaseOrderItem.item.barcode', name: 'purchaseOrderItem.item.barcode', searchable: true, orderable: false, search: {value: '', regex: false}},
      { data: 'warehouse.name', name: 'warehouse.name', searchable: true, orderable: false, search: {value: '', regex: false}},
    ]
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private cashBoxService: CashboxService
  ) {
  }

  ngOnInit() {
    this.loadData().then(value => null)
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInputProductModel.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.cashBoxService.data_table_main(this.dataTableInputProductModel));
      this.stockView = data.data as StockView[];
      this.totalRecords = data.recordsFiltered;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputProductModel.start || event.rows !== this.dataTableInputProductModel.length) {
      this.dataTableInputProductModel.start = event.first;
      this.dataTableInputProductModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }
}

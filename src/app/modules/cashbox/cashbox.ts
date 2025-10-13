import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Splitter} from 'primeng/splitter';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DatePipe, DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {CarService} from '../../service/modules/cashbox/car-service';
import {Toolbar} from 'primeng/toolbar';
import {InputText} from 'primeng/inputtext';
import {DataView} from 'primeng/dataview';
import {SelectButton} from 'primeng/selectbutton';
import {Tag} from 'primeng/tag';
import {CashboxService} from './cashbox.service';
import {firstValueFrom} from 'rxjs';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {AddCartItemDto, CartItem, CartSession, StockView} from './cashbox.model';
import {Tooltip} from 'primeng/tooltip';
import {CashBoxWebsocketService} from './cashbox.websocket';
import {OrderList} from 'primeng/orderlist';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-cashbox',
  imports: [
    Splitter,
    Button,
    FormsModule,
    TableModule,
    InputText,
    RouterLink,
    DataView,
    SelectButton,
    NgClass,
    Tag,
    DecimalPipe,
    Tooltip,
    DatePipe,
    OrderList,
    Ripple
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

  private holdInterval: any;
  startHold(action: () => any) {
    action(); // darhol bajar
    this.holdInterval = setInterval(action, 120);
  }
  stopHold() {
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }
  }

  cartSessionModel?: CartSession;
  cartItems?: CartItem[] | [];

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
      {
        data: 'purchaseOrderItem.item.name',
        name: 'purchaseOrderItem.item.name',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'purchaseOrderItem.item.barcode',
        name: 'purchaseOrderItem.item.barcode',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'warehouse.name',
        name: 'warehouse.name',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
    ]
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private cashBoxService: CashboxService,
    private cashBoxWebSocketService: CashBoxWebsocketService,
  ) {}

  ngOnInit() {
    /** 1- LocalStorage dan eski sessiya ID ni o‘qish */
    const savedSessionId = localStorage.getItem("activeCartSessionId")

    /** 2- Backendga create_cart() so‘rovini yuboramiz — agar ID bo‘lsa, u bilan; bo‘lmasa, null bilan */
    firstValueFrom(this.cashBoxService.create_cart({
      activeSessionId: savedSessionId,
      forceNew: false
    }))
      .then(res => {
        /** 3- Backenddan qaytgan sessiyani o‘rnatamiz */
        this.cartSessionModel = res.data as CartSession;

        /** 4- Agar ID yangilangan bo‘lsa — localStorage ga yozamiz */
        if (this.cartSessionModel?.id) {
          localStorage.setItem('activeCartSessionId', this.cartSessionModel.id);
        }

        /** active cart boyicha cartItem larni olib kelish*/
        this.getActiveCartSessionItem(this.cartSessionModel?.id).then(r => null)
        this.cdr.detectChanges();
      });

    this.loadData().then(() => {
      this.cashBoxWebSocketService.connect((updatedStock) => {
        this.updateStockRow(updatedStock);
      });
    });
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

  onNewCartClick() {
    this.isLoading = true;

    this.cashBoxService.create_cart({
      activeSessionId: this.cartSessionModel?.id,
      forceNew: true
    }).subscribe({
      next: (res) => {
        this.cartSessionModel = res.data as CartSession;
        localStorage.setItem("activeCartSessionId", this.cartSessionModel.id);
        this.cartItems = [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  updateStockRow(updated: any) {
    const idx = this.stockView.findIndex(x => x.stockId === updated.stockId);
    if (idx !== -1) {
      this.stockView[idx].reservedQuantity = updated.reservedQuantity;
      this.stockView[idx].availableQuantity = updated.availableQuantity;
      this.stockView[idx].quantity = updated.quantity;
    }
    this.cdr.detectChanges();
  }

  onSelectItem(item: StockView) {
    this.isLoading = true;

    const dto: AddCartItemDto = {
      sessionId: this.cartSessionModel!.id,
      purchaseOrderItemId: item.purchaseOrderItemId,
      quantity: 1,
      unitPrice: item.salePrice
    };

    this.cashBoxService.add_item(dto).subscribe({
      next: (res) => {
        this.getActiveCartSessionItem(this.cartSessionModel!.id).then(value => {
          console.log('✅ Savatga qo‘shildi:', res);
          this.isLoading = false;
        })
        // emit event -> cart panelni yangilash
      },
      error: (err) => {
        console.error('❌ Qo‘shishda xatolik:', err);
        this.isLoading = false;
      }
    });
  }

  async getActiveCartSessionItem(id: string) {
    const response = await firstValueFrom(this.cashBoxService.get_item(id))

    if (response.success && response.data) {
      this.cartItems = response.data as CartItem[];
      this.cdr.detectChanges();
    }
  }

  increase(item: CartItem) {
    const dto = { cartItemId: item.cartItemId, newQuantity: item.quantity + 1 };
    this.cashBoxService.update_item(dto).subscribe({
      next: (res) => {
        item.quantity++;
        item.lineTotal = item.unitPrice * item.quantity;
        this.cdr.detectChanges();
      },
      error: (err) => alert('Xatolik: ' + err.error.message)
    });
  }

  decrease(item: CartItem) {
    if (item.quantity <= 1) return;
    const dto = { cartItemId: item.cartItemId, newQuantity: item.quantity - 1 };
    this.cashBoxService.update_item(dto).subscribe({
      next: (res) => {
        item.quantity--;
        item.lineTotal = item.unitPrice * item.quantity;
        this.cdr.detectChanges();
      },
      error: (err) => alert('Xatolik: ' + err.error.message)
    });
  }

  subtotal(): number {
    if (!this.cartItems || this.cartItems.length === 0) {
      return 0;
    }
    return this.cartItems.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputProductModel.start || event.rows !== this.dataTableInputProductModel.length) {
      this.dataTableInputProductModel.start = event.first;
      this.dataTableInputProductModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  removeItem(item: any) {

  }

  checkout() {
  }

  clearCart() {

  }
}

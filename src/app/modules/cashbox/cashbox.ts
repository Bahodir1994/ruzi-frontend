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
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DatePipe, DecimalPipe, NgClass, NgStyle} from '@angular/common';
import {CarService} from '../../service/modules/cashbox/car-service';
import {InputText} from 'primeng/inputtext';
import {DataView} from 'primeng/dataview';
import {SelectButton} from 'primeng/selectbutton';
import {Tag} from 'primeng/tag';
import {CashboxService} from './cashbox.service';
import {firstValueFrom} from 'rxjs';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {AddCartItemDto, CartItem, CartSession, Customer, Referrer, StockView} from './cashbox.model';
import {Tooltip} from 'primeng/tooltip';
import {CashBoxWebsocketService} from './cashbox.websocket';
import {OrderList} from 'primeng/orderlist';
import {Ripple} from 'primeng/ripple';
import {ThemeSwitcher} from '../../configuration/theme/themeswitcher';
import {SplitButton} from 'primeng/splitbutton';
import {Menu} from 'primeng/menu';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Dock} from 'primeng/dock';
import {MenuItem} from 'primeng/api';
import {Popover} from 'primeng/popover';
import {Listbox} from 'primeng/listbox';

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
    NgClass,
    Tag,
    DecimalPipe,
    Tooltip,
    DatePipe,
    OrderList,
    Ripple,
    ThemeSwitcher,
    NgStyle,
    Menu,
    Popover,
    Listbox
  ],
  templateUrl: './cashbox.html',
  standalone: true,
  styleUrl: './cashbox.scss',
  providers: [CarService],
  encapsulation: ViewEncapsulation.None
})
export class Cashbox implements OnInit, AfterViewInit {
  isMobile = false;
  isTablet = false;
  isDesktop = false;

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
  customers?: Customer[] | [];
  referrers?: Referrer[] | [];

  selectedCustomers?: Customer[] | [];
  selectedReferrers?: Referrer[] | [];


  layout: "grid" | "list" = "list";
  options = ['list', 'grid'];
  menuItems = [
    {
      label: 'Yangi savat',
      icon: 'pi pi-plus-circle',
      command: () => this.createNewCart()
    },
    {
      label: 'Savatni tozalash',
      icon: 'pi pi-trash',
      command: () => this.clearCart()
    },
    { separator: true },
    {
      label: 'Savatni bekor qilish',
      icon: 'pi pi-times-circle',
      command: () => this.cancelCart()
    }
  ];

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
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef,
    private cashBoxService: CashboxService,
    private cashBoxWebSocketService: CashBoxWebsocketService,
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
    console.log({
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop
    });

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
  async getActiveCartSessionItem(id: string) {
    const response = await firstValueFrom(this.cashBoxService.get_item(id))

    if (response.success && response.data) {
      this.cartItems = response.data as CartItem[];
      this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
  removeItem(cartItemId: string) {
    firstValueFrom(this.cashBoxService.delete_item(cartItemId))
      .then(res => {
        if (res.success) {
          this.getActiveCartSessionItem(this.cartSessionModel!.id).then(r => null)
          this.cdr.detectChanges();
        }
      })
  }
  checkout() {
  }

  openCustomers() {
    console.log('👥 Mijozlar oynasi ochildi');
  }
  openReferrers() {
    console.log('🤝 Xamkorlar ro‘yxati ochildi');
  }
  createNewCart() {
    console.log('🆕 Yangi savat yaratildi');
  }
  clearCart() {
    firstValueFrom(this.cashBoxService.delete_cart(this.cartSessionModel!.id))
      .then(res => {
        if (res.success) {
          this.onNewCartClick();
        }
      })
  }
  cancelCart() {
    firstValueFrom(this.cashBoxService.cancel_cart(this.cartSessionModel!.id))
      .then(res => {
        if (res.success) {
          this.onNewCartClick();
        }
      })
  }
}

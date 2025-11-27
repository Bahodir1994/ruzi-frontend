import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Splitter} from 'primeng/splitter';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DatePipe, DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {CarService} from '../../service/modules/cashbox/car-service';
import {InputText} from 'primeng/inputtext';
import {DataView} from 'primeng/dataview';
import {Tag} from 'primeng/tag';
import {CashboxService} from './cashbox.service';
import {firstValueFrom} from 'rxjs';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {AddCartItemDto, AddPersonToCart, CartItem, CartSession, StockView} from './cashbox.model';
import {Tooltip} from 'primeng/tooltip';
import {CashBoxWebsocketService} from './cashbox.websocket';
import {Ripple} from 'primeng/ripple';
import {ThemeSwitcher} from '../../configuration/theme/themeswitcher';
import {Menu} from 'primeng/menu';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Popover} from 'primeng/popover';
import {Listbox} from 'primeng/listbox';
import {Chip} from 'primeng/chip';
import {PaymentsDialog} from '../payments-dialog/payments-dialog';
import {Dialog} from 'primeng/dialog';
import {InputNumber} from 'primeng/inputnumber';
import {ContextMenu} from 'primeng/contextmenu';
import {MenuItem} from 'primeng/api';
import {FloatLabel} from 'primeng/floatlabel';
import {Divider} from 'primeng/divider';
import {ImageFallbackDirective} from "../../configuration/directives/image.fallback";
import {environment} from '../../../environments/environment';
import {Drawer} from 'primeng/drawer';
import {Card} from 'primeng/card';
import {QuickTile} from '../../component/quick-tile/quick-tile';
import {IconField} from 'primeng/iconfield';
import {FocusTrap} from 'primeng/focustrap';
import {InputIcon} from 'primeng/inputicon';
import {Checkbox} from 'primeng/checkbox';
import {AutoFocus} from 'primeng/autofocus';
import {CustomerModel} from '../settings/customer/customer.model';
import {ReferrerModel} from '../settings/referrer/referrer.model';
import {Carts} from '../carts/carts';

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
    Ripple,
    ThemeSwitcher,
    Menu,
    Popover,
    Listbox,
    Chip,
    PaymentsDialog,
    Dialog,
    InputNumber,
    ContextMenu,
    FloatLabel,
    Divider,
    ImageFallbackDirective,
    NgOptimizedImage,
    Drawer,
    QuickTile,
    IconField,
    FocusTrap,
    InputIcon,
    Checkbox,
    AutoFocus,
    Card,
    ReactiveFormsModule,
    Carts
  ],
  templateUrl: './cashbox.html',
  standalone: true,
  styleUrl: './cashbox.scss',
  providers: [CarService],
  encapsulation: ViewEncapsulation.None
})
export class Cashbox implements OnInit, AfterViewInit, OnChanges {
  isMobile = false;
  isTablet = false;
  isDesktop = false;

  @ViewChild('cm') cm!: ContextMenu;
  @ViewChild('cmm') cmm!: ContextMenu;
  @ViewChild(Listbox) listbox!: Listbox;
  @ViewChild('searchInput') searchInput!: ElementRef;

  contextMenuItems: MenuItem[] = [];
  contextMenuCartItems: MenuItem[] = [];
  editPriceVisible = false;
  editQuantityVisible = false;
  discountOnly = false;
  editedItem: any = null;
  editedQuantity = 0;
  editedPrice = 0;
  editedDiscount = 0;
  originalPrice = 0;
  minimalPrice = 0;
  computedPrice = 0;

  imagePathPrefix = environment.minioThumbUrl;

  formCustomer!: FormGroup;
  formReferrer!: FormGroup;
  selectedForm: 'customer' | 'referrer' | null = null;
  visibleDrawerUsers = false;
  popoverOpen = false;

  visibleDrawerCartsList = false;

  onPopoverShow() {
    this.popoverOpen = true;

    /** listbox ichidagi filter inputni topish */
    setTimeout(() => {
      const input = (this.listbox?.el.nativeElement as HTMLElement)
        .querySelector('input.p-inputtext');
      if (input) (input as HTMLInputElement).focus();
    }, 50);
  }

  onPopoverHide() {
    this.popoverOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    /** Agar popover yopiq bo‘lsa — tashqi searchInput fokus oladi */
    // if (!this.popoverOpen && this.searchInput) {
    //   this.searchInput.nativeElement.focus();
    // }
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
  customers?: CustomerModel[] | [];
  referrers?: ReferrerModel[] | [];

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
    {separator: true},
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
      }
    ]
  }

  /** To‘lov oynasi uchun: */
  payVisible = false;
  refPercentDefault = 2; // ixtiyoriy default bonus %

  get hasCustomer(): boolean {
    return !!this.cartSessionModel?.customer;
  }

  constructor(
    private deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cashBoxService: CashboxService,
    private cashBoxWebSocketService: CashBoxWebsocketService,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();

    this.contextMenuItems = [
      {
        label: 'Qo‘shimcha birlikda qo‘shish',
        icon: 'pi pi-plus-circle',
        command: () => this.addAltUnitItem(this.editedItem)
      }
    ]
    this.contextMenuCartItems = [
      {
        label: 'Narxni o‘zgartirish',
        icon: 'pi pi-pencil',
        command: () => this.openEditPrice(false)
      },
      {
        label: 'Birlikni o‘zgartirish',
        icon: 'pi pi-box',
        command: () => this.openEditQuantity()
      },
      {
        label: 'Chegirma qo‘llash',
        icon: 'pi pi-percentage',
        command: () => this.openEditPrice(true)
      },
      {separator: true},
      {
        label: 'O‘chirish',
        icon: 'pi pi-trash',
        command: () => this.removeItem(this.editedItem?.cartItemId)
      }
    ]

    /** 1- LocalStorage dan eski sessiya ID ni o‘qish */
    const savedSessionId = localStorage.getItem("activeCartSessionId")

    /** 2- Backendga create_cart() so‘rovini yuboramiz — agar ID bo‘lsa, u bilan; bo‘lmasa, null bilan */
    firstValueFrom(this.cashBoxService.create_cart({
      activeSessionId: savedSessionId,
      forceNew: false
    })).then(res => {
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

    this.formCustomer = this.fb.group({
      fullName: [''],
      phoneNumber: [''],
    })

    this.formReferrer = this.fb.group({
      fullName: [''],
      phone: [''],
    })

    /** mijozlar royxatini chaqirish*/
    this.openCustomers().then(null);
    this.openReferrers().then(null);
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visibleDrawerUsers) {
      this.resetDrawer();
    }
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

      // 🆕 alt birlik uchun
      this.stockView[idx].altQuantity = updated.altQuantity;
      this.stockView[idx].reservedAltQuantity = updated.reservedAltQuantity;
      this.stockView[idx].availableAltQuantity = updated.availableAltQuantity;
    }
    this.cdr.detectChanges();
  }

  onSelectItem(item: StockView) {
    this.isLoading = true;

    const dto: AddCartItemDto = {
      sessionId: this.cartSessionModel!.id,
      purchaseOrderItemId: item.purchaseOrderItemId,
      quantity: 1,
      unitPrice: item.salePrice,
      unitType: 'PACK'
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
        this.isLoading = false;
      }
    });
  }

  addAltUnitItem(item: StockView) {
    if (!item || !this.cartSessionModel) return;

    // alt birlikda qo‘shish uchun quantity = 1, narx = asosiy narx / conversionRate
    const conversionRate = item.conversionRate || 1;
    const altPrice = item.altSalePrice ? item.altSalePrice : 0.00;

    const dto: AddCartItemDto = {
      sessionId: this.cartSessionModel.id,
      purchaseOrderItemId: item.purchaseOrderItemId,
      quantity: 1,
      unitPrice: altPrice,
      unitType: 'PCS'
    };

    this.isLoading = true;
    this.cashBoxService.add_item(dto).subscribe({
      next: (res) => {
        this.getActiveCartSessionItem(this.cartSessionModel!.id).then(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Qo‘shimcha birlikda qo‘shishda xatolik:', err);
      }
    });
  }

  increase(item: CartItem) {
    const dto = {cartItemId: item.cartItemId, newQuantity: item.quantity + 1};
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
    const dto = {cartItemId: item.cartItemId, newQuantity: item.quantity - 1};
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

  async openCustomers() {
    const response = await firstValueFrom(this.cashBoxService.get_customers())
    if (response.success && response.data) {
      this.customers = response.data as CustomerModel[];
      this.cdr.detectChanges();
    }
  }

  async openReferrers() {
    const response = await firstValueFrom(this.cashBoxService.get_referrers())
    if (response.success && response.data) {
      this.referrers = response.data as ReferrerModel[];
      this.cdr.detectChanges();
    }
  }

  addCustomerToCard(id: string, popover: any) {
    this.isLoading = true;

    const dto: AddPersonToCart = {
      id: id,
      cartSessionId: this.cartSessionModel!.id,
      type: 'CUSTOMER',
    };
    this.cashBoxService.add_customer_referrer(dto).subscribe({
      next: (res) => {
        firstValueFrom(this.cashBoxService.create_cart({
          activeSessionId: this.cartSessionModel!.id,
          forceNew: false
        }))
          .then(res => {
            this.cartSessionModel = res.data as CartSession;

            if (this.cartSessionModel?.id) {
              localStorage.setItem('activeCartSessionId', this.cartSessionModel.id);
            }
            popover.hide();
            this.getActiveCartSessionItem(this.cartSessionModel?.id).then(r => null)
            this.cdr.detectChanges();
          });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  addReferrerToCard(id: string, popover: any) {
    this.isLoading = true;

    const dto: AddPersonToCart = {
      id: id,
      cartSessionId: this.cartSessionModel!.id,
      type: 'REFERRER',
    };
    this.cashBoxService.add_customer_referrer(dto).subscribe({
      next: (res) => {
        firstValueFrom(this.cashBoxService.create_cart({
          activeSessionId: this.cartSessionModel!.id,
          forceNew: false
        }))
          .then(res => {
            this.cartSessionModel = res.data as CartSession;

            if (this.cartSessionModel?.id) {
              localStorage.setItem('activeCartSessionId', this.cartSessionModel.id);
            }
            popover.hide();
            this.getActiveCartSessionItem(this.cartSessionModel?.id).then(r => null)
            this.cdr.detectChanges();
          });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  removeCusRefFromCart(id: string, type: string) {
    this.isLoading = true;

    const dto: AddPersonToCart = {
      id: id,
      cartSessionId: this.cartSessionModel!.id,
      type: type,
    };
    this.cashBoxService.remove_customer_referrer(dto).subscribe({
      next: (res) => {
        firstValueFrom(this.cashBoxService.create_cart({
          activeSessionId: this.cartSessionModel!.id,
          forceNew: false
        }))
          .then(res => {
            this.cartSessionModel = res.data as CartSession;

            if (this.cartSessionModel?.id) {
              localStorage.setItem('activeCartSessionId', this.cartSessionModel.id);
            }

            this.getActiveCartSessionItem(this.cartSessionModel?.id).then(r => null)
            this.cdr.detectChanges();
          });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  createNewCart() {
    this.onNewCartClick();
  }

  clearCart() {
    firstValueFrom(this.cashBoxService.delete_cart(this.cartSessionModel!.id))
      .then(res => {
        if (res.success) {
          this.getActiveCartSessionItem(this.cartSessionModel!.id);
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

  checkout() {
    if (!this.cartItems || this.cartItems.length === 0) return;
    this.payVisible = true;
  }

  onPayClosed(ev: { success: boolean; result?: any }) {
    this.payVisible = false;

    if (ev?.success && ev.result) {
      // ev.result: CheckoutResultDto (paymentStatus, debt, change, va h.k.)
      // Chek yopildi — yangi savat ochib, UI ni “nol” holatga qaytaramiz
      this.onNewCartClick();
      // Agar xohlasangiz: chek chop etish/kv_tasniflashni shu yerda chaqirasiz
      // this.printReceipt(ev.result);
    }
  }

  onContextMainMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.editedItem = item;
    this.cmm.show(event);
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.editedItem = item;
    this.cm.show(event);
  }

  openEditPrice(discountOnly = false) {
    if (!this.editedItem) return;

    this.editPriceVisible = true;

    // Asl narx (salePrice mavjud bo‘lsa, o‘shani ko‘rsatamiz)
    this.originalPrice = this.editedItem.salePrice || this.editedItem.unitPrice || 0;

    // Minimal narx
    this.minimalPrice = this.editedItem.minimalSum || 0;

    // Hozirgi ishlayotgan narx
    this.editedPrice = this.editedItem.unitPrice || this.originalPrice;

    // 🧠 Agar saleDiscount summaviy bo‘lsa, foizga o‘tkazamiz
    if (this.editedItem.saleDiscount && this.editedItem.saleDiscount > 1) {
      const diff = this.originalPrice - this.editedPrice;
      this.editedDiscount = diff > 0
        ? Math.round((diff / this.originalPrice) * 100 * 100) / 100  // 2 xonagacha aniqlik
        : 0;
    } else {
      // Aks holda oldingi foizni saqlaymiz
      this.editedDiscount = this.editedItem.saleDiscount ?? 0;
    }

    this.discountOnly = discountOnly;
    this.recalculateDiscount();
  }

  recalculateDiscount() {
    const discountAmount = (this.editedPrice * (this.editedDiscount || 0)) / 100;
    this.computedPrice = Math.max(0, this.editedPrice - discountAmount);
  }

  applyPriceChange() {
    if (!this.editedItem) return;

    const finalPrice = this.computedPrice;

    // 🔹 Minimal narxdan past narxni tekshirish
    if (this.minimalPrice && finalPrice < this.minimalPrice) {
      if (!confirm(`Diqqat! Narx minimal narxdan past: ${this.minimalPrice.toLocaleString()} so‘m. Baribir davom etilsinmi?`)) {
        return;
      }
    }

    // 🔹 Lokal qiymatlarni yangilaymiz (frontend preview uchun)
    this.editedItem.unitPrice = finalPrice;
    this.editedItem.saleDiscount = this.editedDiscount;
    this.editedItem.lineTotal = finalPrice * this.editedItem.quantity;

    // 🔹 DTO tayyorlaymiz
    const dto = {
      cartItemId: this.editedItem.cartItemId,
      newPrice: this.editedPrice,
      discountPercent: this.editedDiscount
    };

    // 🔹 API chaqiramiz
    this.cashBoxService.update_item_price(dto).subscribe({
      next: (res) => {
        console.log('✅ Narx yangilandi:', res);
        this.editPriceVisible = false;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('❌ Xatolik narxni yangilashda:', err);
        alert('Narxni yangilashda xatolik yuz berdi');
      }
    });
  }

  openEditQuantity() {
    if (!this.editedItem) return;

    this.editQuantityVisible = true;
    this.editedQuantity = this.editedItem.quantity || 0;
  }

  applyQuantityChange() {
    if (!this.editedItem || !this.editedQuantity) return;

    const dto = {
      cartItemId: this.editedItem.cartItemId,
      newQuantity: this.editedQuantity
    };

    // 🔹 Backendga yuborish
    this.cashBoxService.update_item(dto).subscribe({
      next: (res) => {
        console.log('✅ Miqdor yangilandi:', res);
        this.editedItem.quantity = this.editedQuantity;
        this.editedItem.lineTotal = this.editedItem.unitPrice * this.editedQuantity;
        this.editQuantityVisible = false;
        this.cdr.detectChanges();
      },
      // error: (err) => {
      //   console.error('❌ Xatolik miqdorni yangilashda:', err);
      //   alert('Miqdor yangilanmadi: ' + err.error?.message);
      // }
    });
  }

  onAddCustomer() {
    this.selectedForm = 'customer';
    this.formCustomer.reset();
  }
  createCustomer() {
    const fromCustomer = this.formCustomer.value;
    this.cashBoxService.create_customer_referrer(fromCustomer, 'customer').subscribe({
      next: (res) => {
        this.openCustomers();
        this.formCustomer.reset()
      }
    })
  }

  onAddReferrer() {
    this.selectedForm = 'referrer';
    this.formReferrer.reset();
  }
  createReferrer() {
    const formReferrer = this.formReferrer.value;
    this.cashBoxService.create_customer_referrer(formReferrer, 'referrer').subscribe({
      next: (res) => {
        this.openReferrers();
        this.formReferrer.reset()
      }
    })
  }

  resetDrawer() {
    this.selectedForm = null;
    this.formCustomer.reset();
    this.formReferrer.reset();
  }

  formatStock(
    availableAltQuantity?: number,
    conversionRate?: number,
    displayUnit?: string
  ): string {
    const avail = availableAltQuantity ?? 0;
    const rate = conversionRate ?? 1;

    if (avail <= 0) return `0 ${displayUnit ?? ''}`;

    const packs = Math.floor(avail / rate);
    const remainder = avail % rate;

    if (packs > 0 && remainder > 0)
      return `${packs} ${displayUnit ?? ''} ${remainder} pcs`;
    if (packs > 0)
      return `${packs} ${displayUnit ?? ''}`;
    if (remainder > 0)
      return `${remainder} pcs`;

    return `0 ${displayUnit ?? ''}`;
  }
}

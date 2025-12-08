import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {Card} from 'primeng/card';
import {DatePipe, DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Menu} from 'primeng/menu';
import {CartsService} from './carts.service';
import {CartItem, CartPayment, CartSession, CartStats} from './carts.model';
import {MenuItem} from 'primeng/api';
import {SelectButton} from 'primeng/selectbutton';
import {Select} from 'primeng/select';
import {FloatLabel} from 'primeng/floatlabel';
import {Dialog} from 'primeng/dialog';
import {Ripple} from 'primeng/ripple';
import {DataView} from 'primeng/dataview';
import {Listbox} from 'primeng/listbox';
import {Badge} from 'primeng/badge';
import {CustomerModel} from '../settings/customer/customer.model';
import {ReferrerModel} from '../settings/referrer/referrer.model';

@Component({
  selector: 'app-carts',
  imports: [
    Card,
    NgOptimizedImage,
    Button,
    InputText,
    FormsModule,
    IconField,
    InputIcon,
    TableModule,
    Tag,
    DecimalPipe,
    DatePipe,
    Menu,
    ReactiveFormsModule,
    SelectButton,
    Select,
    FloatLabel,
    Dialog,
    Ripple,
    NgClass,
    DataView,
    Listbox,
    Badge
  ],
  templateUrl: './carts.html',
  standalone: true,
  styleUrl: './carts.scss'
})
export class Carts implements OnInit {
  @ViewChild('dialog') dialog!: Dialog;

  shouldMaximize = false;
  showCartDetailModal = false;
  form!: FormGroup;

  /** MAIN TABLE DATA */
  totalRecords: number = 0;
  allRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  defDate: string = this.getLocalDate(3);
  date: Date = new Date(new Date().setDate(new Date().getDate() - 3));

  periodOrder: ('day' | 'week' | 'month' | '3month' | '6month' | 'year')[] =['day', 'week', 'month', '3month', '6month', 'year'];
  selectedPeriod: 'day' | 'week' | 'month' | '3month' | '6month' | 'year' = 'day';
  stateOptions: any[] = [
    {label: 'Kun', value: 'day', class: 'bg-dark-500'},
    {label: 'Hafta', value: 'week'},
    {label: 'Oy', value: 'month'},
    {label: 'Chorak', value: '3month'},
    {label: 'Yarim', value: '6month'},
    {label: 'Yil', value: 'year'},
  ];
  selectPaymentType: MenuItem[] = [
    {label: 'Naqd', value: 'CASH'},
    {label: 'Plastik', value: 'CARD'},
    {label: 'Aralash', value: 'MIXED'},
  ]
  selectPaymentStatus: MenuItem[] = [
    {label: 'To`langan', value: 'PAID'},
    {label: 'To`lanmagan', value: 'UNPAID'},
    {label: 'Qisman', value: 'PARTIAL'},
  ]
  selectedPaymentStatus = '';
  selectedPaymentType = '';
  totalAmountPeriod = 0;
  paidAmountPeriod = 0;
  debtAmountPeriod = 0;

  cartSessionModel: CartSession[] = [];
  cartSessionSelectedModel?: CartSession;
  dataTableInputCartSessionModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 1, dir: 'desc'}],  // insTime bo‘yicha desc
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},

      {data: 'insTime', name: 'insTime', searchable: false, orderable: true, search: {value: '', regex: false}},

      {data: 'cartNumber', name: 'cartNumber', searchable: true, orderable: false, search: {value: '', regex: false}},

      {data: 'paymentType', name: 'paymentType', searchable: true, orderable: false, search: {value: '', regex: false}},

      {
        data: 'paymentStatus',
        name: 'paymentStatus',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },

      {data: 'status', name: 'status', searchable: true, orderable: false, search: {value: '', regex: false}},

      {data: 'totalAmount', name: 'totalAmount', searchable: false, orderable: true, search: {value: '', regex: false}},

      {data: 'paidAmount', name: 'paidAmount', searchable: false, orderable: true, search: {value: '', regex: false}},

      {data: 'debtAmount', name: 'debtAmount', searchable: false, orderable: true, search: {value: '', regex: false}},

      {
        data: 'createdByUser',
        name: 'createdByUser',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },

      {data: 'createdAt', name: 'createdAt', searchable: true, orderable: true, search: {value: '', regex: false}},

      {data: 'closedAt', name: 'closedAt', searchable: false, orderable: true, search: {value: '', regex: false}},

      {data: 'isDeleted', name: 'isDeleted', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  };

  cartItems: CartItem[] | undefined;
  cartPayments: CartPayment[] | undefined;
  cartCustomer: CustomerModel | undefined;
  cartReferrer: ReferrerModel | undefined;

  autoDetectPeriodIndex = 0;
  autoDetecting = false;

  constructor(
    private cartService: CartsService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
    this.autoDetectPeriods();
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputCartSessionModel.start ||
      event.rows !== this.dataTableInputCartSessionModel.length) {

      this.dataTableInputCartSessionModel.start = event.first;
      this.dataTableInputCartSessionModel.length = event.rows;

      this.loadData();
    }
  }

  protected loadData() {
    this.isLoading = true;

    this.dataTableInputCartSessionModel.draw++;

    // GLOBAL SEARCH
    if (this.searchValue != null) {
      this.dataTableInputCartSessionModel.search.value = this.searchValue;
    }

    /** 1) DATE FILTER — createdAt (column 10) */
    if (this.date != null) {
      const yyyy = this.date.getFullYear();
      const mm = String(this.date.getMonth() + 1).padStart(2, '0');
      const dd = String(this.date.getDate()).padStart(2, '0');

      this.dataTableInputCartSessionModel.columns[10].search.value =
        `${yyyy}-${mm}-${dd}`;
    } else {
      this.dataTableInputCartSessionModel.columns[10].search.value = '';
    }

    /** 2) PAYMENT TYPE FILTER — column 3 */
    this.dataTableInputCartSessionModel.columns[3].search.value =
      this.selectedPaymentType ?? '';

    /** 3) PAYMENT STATUS FILTER — column 4 */
    this.dataTableInputCartSessionModel.columns[4].search.value =
      this.selectedPaymentStatus ?? '';

    /** BACKEND CALL */
    this.cartService.data_table_card_main(this.dataTableInputCartSessionModel)
      .subscribe(value => {
        this.cartSessionModel = value.data as CartSession[];
        this.totalRecords = value.recordsFiltered;
        this.allRecords = value.recordsTotal;
        this.cdr.detectChanges();
        this.isLoading = false;
      });
  }

  onDialogShown() {
    if (this.shouldMaximize) {
      this.dialog.maximize();
      this.shouldMaximize = false;
    }
  }
  openEditCart(row: CartSession) {
    this.cartSessionSelectedModel = row;
    this.getSelectedCartSessionItem(this.cartSessionSelectedModel.id)
    this.getSelectedCartSessionPayment(this.cartSessionSelectedModel.id)
    if (this.cartSessionSelectedModel.customer){
      this.getSelectedCartSessionCustomer(this.cartSessionSelectedModel.customer.id)
    }
    if (this.cartSessionSelectedModel.referrer){
      this.getSelectedCartSessionReferrer(this.cartSessionSelectedModel.referrer.id)
    }
  }
  private getLocalDate(daysAgo: number = 0): string {
    const now = new Date();
    now.setDate(now.getDate() - daysAgo);

    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }
  getRowActions(row: CartSession): MenuItem[] {
    return [
      {
        label: 'Batafsil',
        icon: 'pi pi-file-edit',
        styleClass: 'text-blue-600 hover:bg-blue-50',
        command: () => {
          this.openEditCart(row)
          this.shouldMaximize = true;
          this.showCartDetailModal = true;
        }
      },
      {
        label: 'Kassada taxrirlash',
        icon: 'pi pi-file-edit',
        styleClass: 'text-yellow-600 hover:bg-yellow-50 border-t',
        command: () => {
          this.openEditCart(row)
          this.shouldMaximize = true;
          this.showCartDetailModal = true;
        }
      }
    ];
  }

  setPeriod() {
    this.setPeriodWithCallback(() => {});
  }
  autoDetectPeriods() {
    this.autoDetecting = true;
    this.autoDetectPeriodIndex = 0;

    this.tryNextPeriod();
  }
  tryNextPeriod() {
    if (this.autoDetectPeriodIndex >= this.periodOrder.length) {
      this.selectedPeriod = 'day';
      this.setPeriod();
      this.autoDetecting = false;
      return;
    }
    this.selectedPeriod = this.periodOrder[this.autoDetectPeriodIndex];
    this.setPeriodWithCallback((isZero) => {
      if (isZero) { ``
        // 3 sekunddan keyin keyingisini tekshir
        setTimeout(() => {
          this.autoDetectPeriodIndex++;
          this.tryNextPeriod();
        }, 2000);
      } else {
        // Ma'lumot topildi → shu periodda to‘xtaydi
        this.autoDetecting = false;
      }
    });
  }
  setPeriodWithCallback(callback: (isZero: boolean) => void) {
    this.cartService.getStatistics(this.selectedPeriod).subscribe(value => {
      const stats = value.data as CartStats;

      this.totalAmountPeriod = stats.totalAmount;
      this.paidAmountPeriod = stats.paidAmount;
      this.debtAmountPeriod = stats.debtAmount;

      this.cdr.detectChanges();

      const isZero = stats.totalAmount === 0;
      callback(isZero);
    });
  }

  onDateChange(event: string) {
    this.date = new Date(event);
    this.loadData();
  }
  onPayTypeAndPayStatusChange() {
    this.loadData();
  }

  getSelectedCartSessionItem(id: string | null) {
    this.cartService.get_item(id).subscribe(value => {
      this.cartItems = value.data as CartItem[];
      this.cdr.detectChanges()
    })
  }
  getSelectedCartSessionPayment(id: string | null) {
    this.cartService.get_payment(id).subscribe(value => {
      this.cartPayments = value.data as CartPayment[];
      this.cdr.detectChanges()
    })
  }
  getSelectedCartSessionCustomer(id: string | null) {
    this.cartService.get_customer(id).subscribe(value => {
      this.cartCustomer = value.data as CustomerModel;
      this.cdr.detectChanges()
    })
  }
  getSelectedCartSessionReferrer(id: string | null) {
    this.cartService.get_referrer(id).subscribe(value => {
      this.cartReferrer = value.data as ReferrerModel;
      this.cdr.detectChanges()
    })
  }
}

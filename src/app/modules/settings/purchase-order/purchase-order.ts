import {ChangeDetectorRef, Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {
  PurchaseOrderItemModel,
  PurchaseOrderModel,
  PurchaseOrderPaymentStatus,
  PurchaseOrderStatus
} from './purchase-order.model';
import {PurchaseOrderService} from './purchase-order.service';
import {DatePipe, DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Card} from 'primeng/card';
import {HasRolesDirective} from 'keycloak-angular';
import {InputNumber} from 'primeng/inputnumber';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Textarea} from 'primeng/textarea';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {Tooltip} from 'primeng/tooltip';
import {AutoComplete} from 'primeng/autocomplete';
import {ItemModel} from '../../items/item/item-model';
import {
  PurchaseOrderPaymentStatusClass,
  PurchaseOrderPaymentStatusLabel
} from '../../../component/enums/PurchaseOrderPaymentStatus';
import {PurchaseOrderStatusClass, PurchaseOrderStatusLabel} from '../../../component/enums/PurchaseOrderStatus';
import {SupplierModel} from '../supplier/supplier.model';
import {WarehouseModel} from '../warehouse/warehouse.model';
import {CurrencyOptions} from '../../../component/constants/currency.constant';
import {Badge} from 'primeng/badge';
import {Tag} from 'primeng/tag';
import {BarcodeScanner} from '../../../component/barcode-scanner/barcode-scanner';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  templateUrl: './purchase-order.html',
  styleUrl: './purchase-order.scss',
  imports: [
    Dialog, IconField, InputIcon, InputText, FormsModule, Button, TableModule,
    DatePipe, DecimalPipe, NgClass, Card, HasRolesDirective, NgOptimizedImage,
    Menu, Ripple, ReactiveFormsModule,
    Select, DatePicker, Textarea, InputNumber, Tooltip, AutoComplete, Tag, BarcodeScanner
  ]
})
export class PurchaseOrder {
  /* ============================================================
     --AUTOCOMPLETE
     Tovar izlab uni partiyaga qoshish uchun ozgaruvchilar
   =======================================*/
  currencyOptions = CurrencyOptions;
  isNewOrder: boolean = true
  searchItem: string = "";
  filteredItems: ItemModel[] = [];
  supplierList: SupplierModel[] = [];
  warehouseList: WarehouseModel[] = [];

  /* ============================================================
     3) UI STATE VARIABLES
     — Modal holati, loading flag'lar, permissionlar
     ============================================================ */
  public permissions: Record<string, boolean> = {};
  visiblePurchaseOrderModal = false;

  menuVisible = false;
  editingId!: string | null;
  isLoading: boolean = true;
  searchValue: string | undefined;
  totalRecords: number = 0;

  isLoadingPurItem: boolean = true;
  searchValuePurItem: string | undefined;
  totalRecordsPurItem: number = 0;

  currentEditableOrderId = ''

  /* ============================================================
     4) FORM GROUPLAR
     — Asosiy form (PurchaseOrder)
     — Item form (PurchaseOrderItem)
     ============================================================ */
  form!: FormGroup;
  formItem!: FormGroup;
  formCreateItemSubmit = false;

  /* ============================================================
     6) DATA TABLE MODELLARI (PurchaseOrder)
     — Asosiy jadval uchun server-side struktura
     ============================================================ */
  purchaseOrderModelSingle!: PurchaseOrderModel;
  purchaseOrderModel: PurchaseOrderModel[] = [];
  purchaseOrderItemModelSelected: PurchaseOrderItemModel[] = [];

  dataTableInput: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 1, dir: 'desc'}],
    columns: [
      {data: 'orderNumber', name: 'orderNumber', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'supplier.name', name: 'supplier', searchable: true, orderable: false, search: {value: '', regex: false}},
      {
        data: 'warehouse.name',
        name: 'warehouse',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {data: 'createdAt', name: 'createdAt', searchable: false, orderable: true, search: {value: '', regex: false}},
      {data: 'status', name: 'status', searchable: true, orderable: false, search: {value: '', regex: false}},
      {
        data: 'paymentStatus',
        name: 'paymentStatus',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {data: 'totalAmount', name: 'totalAmount', searchable: false, orderable: true, search: {value: '', regex: false}}
    ]
  };

  /* ============================================================
     7) DATA TABLE MODELLARI (PurchaseOrderItem)
     — Itemlarni serverdan olish struktura
     ============================================================ */
  purchaseOrderItemModel: PurchaseOrderItemModel[] = [];
  dataTableInputItem: DataTableInput = {
    draw: 0,
    start: 0,
    length: -1,
    search: {value: '', regex: false},
    order: [{column: 4, dir: 'desc'}],
    columns: [
      {data: 'purchaseOrder.id', name: 'id', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'item.name', name: 'item', searchable: true, orderable: true, search: {value: '', regex: false}},
      {
        data: 'packageCount',
        name: 'packageCount',
        searchable: false,
        orderable: true,
        search: {value: '', regex: false}
      },
      {data: 'quantity', name: 'quantity', searchable: false, orderable: true, search: {value: '', regex: false}},
      {data: 'unitCode', name: 'unitCode', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'altUnitCode', name: 'altUnitCode', searchable: true, orderable: false, search: {value: '', regex: false}},
      {
        data: 'purchasePrice',
        name: 'purchasePrice',
        searchable: false,
        orderable: true,
        search: {value: '', regex: false}
      },
      {data: 'salePrice', name: 'salePrice', searchable: false, orderable: true, search: {value: '', regex: false}},
      {data: 'discount', name: 'discount', searchable: false, orderable: true, search: {value: '', regex: false}},
      {data: 'sum', name: 'sum', searchable: false, orderable: true, search: {value: '', regex: false}},
      {data: 'batchNumber', name: 'batchNumber', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'expiryDate', name: 'expiryDate', searchable: false, orderable: true, search: {value: '', regex: false}}
    ]
  };

  /* ============================================================
     9) CONSTRUCTOR
     ============================================================ */
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService,
    private fb: FormBuilder
  ) {
  }

  /* ============================================================
     10) ngOnInit
     — Formlarni yaratish
     — Actionlar tayyorlash
     — Asosiy jadvalni yuklash
     ============================================================ */
  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');
    this.loadSupplierList();
    this.loadWarehouseList();

    this.form = this.fb.group({
      orderNumber: new FormControl({value: '', disabled: true}, Validators.required),
      supplierId: [null, Validators.required],
      warehouseId: [null, Validators.required],
      currency: [null, Validators.required],
      dueDate: [null],
      comment: [''],
      status: [''],
      totalAmount: [{value: 0, disabled: true}],
      paidAmount: [0],
      debtAmount: [{value: 0, disabled: true}],
    });

    this.formItem = this.fb.group({
      itemId: [null, Validators.required],
      packageCount: [0, Validators.required],
      quantity: [0, Validators.required],
      unitCode: [null, Validators.required],
      altUnitCode: [null],
      purchasePrice: [0, Validators.required],
      salePrice: [null],
      altSalePrice: [null],
      minimalSum: [null],
      discount: [null],
      batchNumber: [''],
      expiryDate: [null],
    });
  }

  getRowActions(row: ItemModel): MenuItem[] {
    return [
      {
        label: 'O‘chirish',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600 hover:bg-red-50',
        command: () => this.deleteOrder(row.id)
      }
    ];
  }

  /* ============================================================
     11) PERMISSION CHECK
     ============================================================ */
  permission(status: string) {
    this.permissions = {
      add_new_product: this.permissionService.canAccess(PurchaseOrder, 'add_new_product', status)
    };
  }

  /* ============================================================
     12) loadData - ASOSIY JADVAL va loadDataItem Tovar KIRIM TOVAR JADVALIINI YOZIB KELISH
     ============================================================ */
  async loadData() {
    this.isLoading = true;

    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }

    try {
      const res = await firstValueFrom(
        this.purchaseOrderService.data_table_main(this.dataTableInput)
      );

      this.purchaseOrderModel = (res.data as PurchaseOrderModel[]).map(row => ({
        ...row,
        statusName: PurchaseOrderStatusLabel[row.status as PurchaseOrderStatus],
        statusClass: PurchaseOrderStatusClass[row.status as PurchaseOrderStatus],
        paymentStatusName: PurchaseOrderPaymentStatusLabel[row.paymentStatus as PurchaseOrderPaymentStatus],
        paymentStatusClass: PurchaseOrderPaymentStatusClass[row.paymentStatus as PurchaseOrderPaymentStatus],
      }));

      this.totalRecords = res.recordsFiltered;
      this.cdr.detectChanges();

    } finally {
      this.isLoading = false;
    }
  }

  async loadPurOrderSingle() {
    this.purchaseOrderService.read_order(this.currentEditableOrderId).subscribe({
      next: value => {
        const data = value.data as PurchaseOrderModel;

        this.purchaseOrderModelSingle = data;

        this.form.patchValue({
          ...data,
          supplierId: data.supplier?.id,
          warehouseId: data.warehouse?.id,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        });

        this.cdr.detectChanges();
      }
    });
  }

  async loadPurItemData() {
    this.isLoadingPurItem = true;

    this.dataTableInputItem.columns[0].search.value = this.currentEditableOrderId;
    this.dataTableInputItem.search.value = '';

    try {
      const data = await firstValueFrom(
        this.purchaseOrderService.data_table_pur_item(this.dataTableInputItem)
      );

      this.purchaseOrderItemModel = data.data;
      this.totalRecordsPurItem = data.recordsFiltered;
      this.cdr.detectChanges()
    } finally {
      this.isLoadingPurItem = false;
    }
  }

  async loadSupplierList() {
    this.purchaseOrderService.read_supplier().subscribe({
      next: value => {
        this.supplierList = value.data as SupplierModel[];
        this.cdr.detectChanges()
      }
    })
  }

  async loadWarehouseList() {
    this.purchaseOrderService.read_warehouse().subscribe({
      next: value => {
        this.warehouseList = value.data as WarehouseModel[];
        this.cdr.detectChanges()
      }
    })
  }

  /* ============================================================
     13) PAGE CHANGE EVENT
     ============================================================ */
  pageChange(event: any) {
    if (event.first !== this.dataTableInput.start || event.rows !== this.dataTableInput.length) {
      this.dataTableInput.start = event.first;
      this.dataTableInput.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  /* ============================================================
     14) ACTION MENU
     ============================================================ */
  getExcelBtnAction(): MenuItem[] {
    return [
      {
        label: 'Na`muna Excel yuklab olish',
        icon: 'pi pi-download',
        command: () => this.visiblePurchaseOrderModal = true
      }
    ];
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuVisible = !this.menuVisible;
  }

  async onBarcode(scannedCode: string) {

    // 1) Autocomplete inputga scanner qiymatini yozish
    this.searchItem = scannedCode;

    // 2) Autocomplete completeMethod ni qo‘lda chaqirish
    await this.searchItems({ query: scannedCode });

    // 3) Tovarlar listi yangilanishi uchun detectChanges
    this.cdr.detectChanges();

    // 4) Agar bitta tovar bo‘lsa → avtomatik qo‘shamiz
    if (this.filteredItems.length === 1) {
      this.onItemSelect({ value: this.filteredItems[0] });
    }
  }

  /* ============================================================
     15) ITEM TABLE (ADD / REMOVE / RECALCULATE)
     ============================================================ */
  recalculateRow(row: any) {
    const qty = Number(row.quantity);
    const price = Number(row.purchasePrice);
    const discount = Number(row.discount);
    row.sum = qty * price - discount;
  }

  /* ==================================================
  --AUTOCOMPLETE
  // Serverdan tovarni qidiruvchi funkisya
  // Item tanlanganida jadvalga qo‘shish
  // Agar topilmasa → yangi tovar yaratish
  =================================================== */
  async searchItems(event: any) {
    const q = event.query;

    if (!q || q.length < 2) {
      this.filteredItems = [];
      return;
    }

    const res = await firstValueFrom(this.purchaseOrderService.search_items(q));
    this.filteredItems = res.data as ItemModel[];
    this.cdr.detectChanges()
  }

  createNewItem() {
    console.log('Yangi tovar yaratish modal ochish...');
    // shu yerda modal yoki navigate qilasiz
  }

  /* ============================================================
     16) FORM SUBMIT (CREATE / UPDATE)
     ============================================================ */
  async onSubmit(statusAsButton: string) {
    this.formCreateItemSubmit = true;
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      status: statusAsButton
    };

    this.purchaseOrderService.update_order(this.currentEditableOrderId, data).subscribe({
      next: () => {
        this.loadData();
        this.visiblePurchaseOrderModal = false;
        this.cdr.detectChanges()
      }
    });
  }

  createNewOrder() {
    this.isNewOrder = true;

    const formData = {
      id: ''
    }

    this.purchaseOrderService.create_order(formData).subscribe({
      next: value => {
        this.purchaseOrderModelSingle = value.data as PurchaseOrderModel;
        this.visiblePurchaseOrderModal = true;
        this.currentEditableOrderId = this.purchaseOrderModelSingle.id;
        this.form.patchValue(this.purchaseOrderModelSingle);
        this.loadPurItemData();
      }
    })
  }

  onItemSelect(item: any) {
    console.log(item);
    const formData = {
      orderId: this.currentEditableOrderId,
      itemId: item.value.id
    }

    this.purchaseOrderService.add_item_to_order(formData).subscribe({
      next: () => {
        this.loadPurItemData();
        this.searchItem = "";
        this.cdr.detectChanges();
      }
    })
  }

  deleteOrder(id: string) {
    this.purchaseOrderService.delete_order(id).subscribe({
      next: () => {
        this.loadData()
      }
    });
  }

  removeRow(item: any) {
    this.purchaseOrderService.delete_item_from_order(this.currentEditableOrderId, item.id).subscribe({
      next: () => {
        this.loadPurItemData()
        this.loadPurOrderSingle()
        this.cdr.detectChanges()
      }
    });
  }

  onRowSelect(event: any) {
    this.isNewOrder = false;

    this.currentEditableOrderId = event.data.id;

    this.visiblePurchaseOrderModal = true;
    this.loadPurOrderSingle()
    this.loadPurItemData();
  }

  onCellEditComplete(event: any) {
    const {data, field} = event;

    // yangi qiymatni to‘g‘ri olish
    const newValue = data[field];

    console.log("Field:", field);
    console.log("Row ID:", data.id);
    console.log("Value:", newValue);

    const payload = {
      id: data.id,
      field: field,
      value: newValue
    };

    this.purchaseOrderService.update_item_field(payload).subscribe({
      next: () => {
        if (['quantity', 'purchasePrice', 'discount'].includes(field)) {
          data.sum = (data.quantity * data.purchasePrice) - (data.discount || 0);
        }
        this.loadPurOrderSingle()
        this.cdr.detectChanges()
      }
    });
  }
}

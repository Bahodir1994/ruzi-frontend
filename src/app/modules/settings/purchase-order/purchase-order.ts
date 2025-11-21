import {ChangeDetectorRef, Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {PurchaseOrderModel} from './purchase-order.model';
import {PurchaseOrderService} from './purchase-order.service';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {HasRolesDirective} from 'keycloak-angular';
import {InputNumber} from 'primeng/inputnumber';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';
import {MultiSelect} from 'primeng/multiselect';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Textarea} from 'primeng/textarea';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-purchase-order',
  imports: [
    Dialog,
    IconField,
    InputIcon,
    InputText,
    FormsModule,
    Button,
    TableModule,
    DatePipe,
    DecimalPipe,
    NgClass,
    Card,
    HasRolesDirective,
    NgOptimizedImage,
    Menu,
    Ripple,
    MultiSelect,
    ReactiveFormsModule,
    ScrollPanel,
    Select,
    DatePicker,
    Textarea
  ],
  templateUrl: './purchase-order.html',
  standalone: true,
  styleUrl: './purchase-order.scss'
})
export class PurchaseOrder {
  public permissions: Record<string, boolean> = {};
  visiblePurchaseOrderModal = false;

  actions!: MenuItem[];
  selectedActions!: MenuItem[];

  form!: FormGroup;
  formItem!: FormGroup;
  formCreateItemSubmit = false;

  menuVisible = false;
  editingId!: string | null;

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  purchaseOrderModelById: PurchaseOrderModel[] = [];
  purchaseOrderModel: PurchaseOrderModel[] = [];
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
  }

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');

    this.actions = [
      {name: 'Saqlangach oynani yopma!', id: 'NY'},
      {name: 'Saqlangach maydonlarni tozala!', id: 'RM'}
    ];

    this.form = this.fb.group({
      orderNumber: ['', Validators.required],
      supplierId: [null, Validators.required],
      warehouseId: [null, Validators.required],
      currency: [null, Validators.required],
      dueDate: [null],
      comment: ['']
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

  onActionsChange() {
    if (!this.hasNY) {
      this.selectedActions = (this.selectedActions ?? []).filter(a => a.id !== 'RM');
    }
  }

  get hasNY(): boolean {
    return this.selectedActions?.some(a => a.id === 'NY') ?? false;
  }

  permission(status: string) {
    this.permissions = {
      add_new_product: this.permissionService.canAccess(PurchaseOrder, 'add_new_product', status)
    };
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.purchaseOrderService.data_table_main(this.dataTableInput));
      this.purchaseOrderModel = data.data as PurchaseOrderModel[];
      this.totalRecords = data.recordsFiltered;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }

  loadPurchaseOrderbyId() {
    this.purchaseOrderModelById = []
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInput.start || event.rows !== this.dataTableInput.length) {
      this.dataTableInput.start = event.first;
      this.dataTableInput.length = event.rows;
      this.loadData().then(r => null);
    }
  }

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

  async onSubmit() {
    this.formCreateItemSubmit = true;
    if (this.form.invalid) return;


    const data = {
      ...this.form.value,
    };

    if (this.editingId) {
      this.purchaseOrderService.update_order(this.editingId, data).subscribe({
        next: () => {
          this.loadData();
          this.visiblePurchaseOrderModal = false;
          this.editingId = null;
        }
      });
    } else {
      this.purchaseOrderService.create_order(data).subscribe({
        next: () => {
          this.loadData();
          this.visiblePurchaseOrderModal = false;
        }
      });
    }
  }
}

import {ChangeDetectorRef, Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../../../component/datatables/datatable-input.model';
import {PermissionService} from '../../../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {PurchaseOrderModel} from './purchase-order.model';
import {PurchaseOrderService} from './purchase-order.service';
import {DatePipe, DecimalPipe, NgClass} from '@angular/common';

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
    NgClass
  ],
  templateUrl: './purchase-order.html',
  standalone: true,
  styleUrl: './purchase-order.scss'
})
export class PurchaseOrder {
  public permissions: Record<string, boolean> = {};
  visiblePurchaseOrderModal = false;

  openDialog() {
    this.visiblePurchaseOrderModal = true;
  }

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

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
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');
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

  pageChange(event: any) {
    if (event.first !== this.dataTableInput.start || event.rows !== this.dataTableInput.length) {
      this.dataTableInput.start = event.first;
      this.dataTableInput.length = event.rows;
      this.loadData().then(r => null);
    }
  }
}

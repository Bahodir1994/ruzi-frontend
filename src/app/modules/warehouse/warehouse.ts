import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {SelectModule} from 'primeng/select';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonModule} from 'primeng/button';
import {PurchaseOrderModel} from './warehouse.model';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {FilterMetadata, SortEvent} from 'primeng/api';
import {WarehouseService} from '../../service/modules/warehouse/warehouse.service';
import {firstValueFrom} from 'rxjs';
import {Ripple} from 'primeng/ripple';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {PermissionService} from '../../service/validations/permission.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  templateUrl: './warehouse.html',
  styleUrls: ['./warehouse.scss'],
  imports: [
    Tabs, TabList, Tab, TabPanels, TabPanel,
    TableModule, CommonModule,
    InputTextModule, TagModule, SelectModule, MultiSelectModule,
    ProgressBarModule, ButtonModule, IconFieldModule, InputIconModule, Ripple, DatePicker, FormsModule
  ]
})
export class Warehouse implements OnInit {
  public permissions: Record<string, boolean> = {};

  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  totalRecords: number = 0;
  searchValue: string | undefined;
  filters: TableFilterEvent = {};
  isLoading: boolean = true;

  purchaseOrderModel: PurchaseOrderModel[] = [];
  dataTableInputPurchaseOrderModel: DataTableInput = {
    draw: 0,
    start:0,
    length: 10,
    search:{value: '', regex: false},
    order: [{column: 2, dir: 'desc'}],
    columns:[
      {data: 'id', name: 'id', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'orderNumber', name: 'orderNumber', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'createdAt', name: 'createdAt', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'approvedAt', name: 'approvedAt', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'currency', name: 'currency', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'dueDate', name: 'dueDate', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'status', name: 'status', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'paymentStatus', name: 'paymentStatus', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'totalAmount', name: 'totalAmount', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'paidAmount', name: 'paidAmount', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'debtAmount', name: 'debtAmount', searchable: true, orderable: true, search: {value: '', regex: false}},
      {data: 'comment', name: 'comment', searchable: true, orderable: true, search: {value: '', regex: false}},
    ]
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private permissionService: PermissionService) {}

  ngOnInit() {
    this.dateStart = new Date(1991, 0, 1);
    this.loadData().then(r => null);
  }

  canAccess(key: string, status: string): boolean {
    return this.permissionService.canAccess(Warehouse, key, status);
  }

  async loadData() {
    this.isLoading = true;

    this.dataTableInputPurchaseOrderModel.columns.forEach((column) => {
      const columnFilters = (this.filters as { [key: string]: FilterMetadata[] })[column.data];

      if (columnFilters && Array.isArray(columnFilters)) {
        const operator = columnFilters[0]?.operator || 'or';

        const searchParts = columnFilters.flatMap((filter) => {
          if (
            filter.value === null ||
            filter.value === undefined ||
            (Array.isArray(filter.value) && filter.value.length === 0) ||
            (typeof filter.value === 'string' && filter.value.trim() === '')
          ) {
            return [];
          }

          if (Array.isArray(filter.value)) {
            return filter.value.map((val) => `${filter.matchMode}:${val}`);
          }

          return `${filter.matchMode}:${filter.value}`;
        });

        const glue = operator.toLowerCase() === 'and' ? '&&' : '||';

        if (searchParts.length > 0) {
          column.search = {
            value: `${searchParts.join(glue)}`,
            regex: false,
          };
        } else {
          column.search = {
            value: '',
            regex: false,
          };
        }
      }
    });

    if (this.searchValue != null) {
      this.dataTableInputPurchaseOrderModel.search.value = this.searchValue;
    }

    const formattedDateStart = this.formatDate(this.dateStart);
    const formattedDateEnd = this.formatDate(this.dateEnd);
    const docDateColumn = this.dataTableInputPurchaseOrderModel.columns.find(column => column.data === 'createdAt');
    if (docDateColumn) {
      docDateColumn.search.value = `${formattedDateStart};${formattedDateEnd}`;
    }

    try {
      const data = await firstValueFrom(this.warehouseService.data_table_main(this.dataTableInputPurchaseOrderModel));

      this.purchaseOrderModel = data.data as PurchaseOrderModel[];
      this.totalRecords = data.recordsFiltered;
      this.cdr.detectChanges();

    } finally {
      this.isLoading = false;
    }
  }

  onFilter(event: TableFilterEvent) {
    this.filters = event.filters || {};
    Object.entries(this.filters).flatMap(([field, meta]: [string, FilterMetadata[] | undefined]) => {
      if (meta && Array.isArray(meta)) {
        return meta.map(filter => {
          if (filter.matchMode === 'in' && Array.isArray(filter.value)) {
            return filter.value.map(val => ({
              field,
              value: val,
              matchMode: filter.matchMode,
              operator: filter.operator
            }));
          } else {
            return {
              field,
              value: filter.value,
              matchMode: filter.matchMode,
              operator: filter.operator
            };
          }
        });
      }
      return [];
    });

    this.loadData().then(r => null);
  }

  onSort(event: SortEvent) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';

    const columnIndex = this.dataTableInputPurchaseOrderModel.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInputPurchaseOrderModel.order = [{column: columnIndex, dir: sortOrder}];
      this.loadData().then(() => null);
    }
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputPurchaseOrderModel.start || event.rows !== this.dataTableInputPurchaseOrderModel.length) {
      this.dataTableInputPurchaseOrderModel.start = event.first;
      this.dataTableInputPurchaseOrderModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

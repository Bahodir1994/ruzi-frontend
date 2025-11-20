import {ChangeDetectorRef, Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {WarehouseModel} from './warehouse.model';
import {WarehouseService} from './warehouse.service';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-warehouse',
  imports: [
    Button,
    NgClass,
    Dialog,
    FormsModule,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './warehouse.html',
  standalone: true,
  styleUrl: './warehouse.scss'
})
export class Warehouse {
  public permissions: Record<string, boolean> = {};
  visibleWarehouseOrderModal = false;

  openDialog() {
    this.visibleWarehouseOrderModal = true;
  }

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  warehouseModel: WarehouseModel[] = [];
  dataTableInput: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 0, dir: 'asc'}],
    columns: [
      {
        data: 'name',
        name: 'name',
        searchable: true,
        orderable: true,
        search: {value: '', regex: false}
      },
      {
        data: 'address',
        name: 'address',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'type',
        name: 'type',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'status',
        name: 'status',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      }
    ]
  };

  constructor(
    private warehouseService: WarehouseService,
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
      add_new_product: this.permissionService.canAccess(Warehouse, 'add_new_product', status)
    };
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.warehouseService.data_table_main(this.dataTableInput));
      this.warehouseModel = data.data as WarehouseModel[];
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

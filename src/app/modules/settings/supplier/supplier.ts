import {ChangeDetectorRef, Component} from '@angular/core';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {SupplierModel} from './supplier.model';
import {Dialog} from 'primeng/dialog';
import {PrimeTemplate} from 'primeng/api';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {firstValueFrom} from 'rxjs';
import {SupplierService} from './supplier.service';
import {PermissionService} from '../../../service/validations/permission.service';

@Component({
  selector: 'app-supplier',
  imports: [
    Dialog,
    PrimeTemplate,
    IconField,
    InputIcon,
    InputText,
    FormsModule,
    Button,
    TableModule
  ],
  templateUrl: './supplier.html',
  standalone: true,
  styleUrl: './supplier.scss'
})
export class Supplier {
  public permissions: Record<string, boolean> = {};
  visibleSupplierModal = false;

  openDialog() {
    this.visibleSupplierModal = true;
  }

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  supplierModel: SupplierModel[] = [];
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
        data: 'phone',
        name: 'phone',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'email',
        name: 'email',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'contactPerson',
        name: 'contactPerson',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'inn',
        name: 'inn',
        searchable: true,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'bankAccount',
        name: 'bankAccount',
        searchable: false,
        orderable: false,
        search: {value: '', regex: false}
      }
    ]
  };

  constructor(
    private supplierService: SupplierService,
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
      add_supplier: this.permissionService.canAccess(Supplier, 'add_supplier', status)
    };
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.supplierService.data_table_main(this.dataTableInput));
      this.supplierModel = data.data as SupplierModel[];
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

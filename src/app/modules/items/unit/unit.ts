import {ChangeDetectorRef, Component} from '@angular/core';
import {ItemModel} from '../item/item-model';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {ItemService} from '../item/item.service';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {UnitModel} from './unit-model';
import {TableModule} from 'primeng/table';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {UnitService} from "./unit-service";

@Component({
  selector: 'app-unit',
  imports: [
    TableModule,
    IconField,
    InputIcon,
    InputText,
    FormsModule,
    Button,
    Dialog
  ],
  templateUrl: './unit.html',
  standalone: true,
  styleUrl: './unit.scss'
})
export class Unit {
  public permissions: Record<string, boolean> = {};
  visibleProductModal = false;

  openDialog() {
    this.visibleProductModal = true;
  }

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  unitModel: UnitModel[] = [];
  dataTableInputProductModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 1, dir: 'desc'}],
    columns: [
      {data: 'code', name: 'code', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'name', name: 'name', searchable: true, orderable: false, search: {value: '', regex: false}},
    ]
  }

  constructor(
    private unitService: UnitService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService
  ) {}
  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');
  }
  permission(status: string) {
    this.permissions = {
      add_new_product: this.permissionService.canAccess(Unit, 'add_new_product', status)
    };
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInputProductModel.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.unitService.data_table_main(this.dataTableInputProductModel));
      this.unitModel = data.data as UnitModel[];
      this.totalRecords = data.recordsFiltered;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }
  pageChange(event: any) {
    if (event.first !== this.dataTableInputProductModel.start || event.rows !== this.dataTableInputProductModel.length) {
      this.dataTableInputProductModel.start = event.first;
      this.dataTableInputProductModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }
}

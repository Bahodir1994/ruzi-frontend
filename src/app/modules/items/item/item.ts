import {ChangeDetectorRef, Component} from '@angular/core';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {ItemService} from './item.service';
import {PermissionService} from '../../../service/validations/permission.service';
import {FilterMetadata, SortEvent} from 'primeng/api';
import {firstValueFrom} from 'rxjs';
import {ItemModel} from './item-model';
import {Dialog} from 'primeng/dialog';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {Button} from 'primeng/button';
import {DecimalPipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-item',
  imports: [
    Dialog,
    TableModule,
    FormsModule,
    IconField,
    Button,
    DecimalPipe,
    Tag,
    InputIcon,
    InputText
  ],
  templateUrl: './item.html',
  standalone: true,
  styleUrl: './item.scss'
})
export class Item {
  public permissions: Record<string, boolean> = {};
  visibleProductModal = false;

  openDialog() {
    this.visibleProductModal = true;
  }

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  itemModel: ItemModel[] = [];
  dataTableInputProductModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 1, dir: 'desc'}],
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'insTime', name: 'insTime', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'skuCode', name: 'skuCode', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'barcode', name: 'barcode', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'name', name: 'name', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'brand', name: 'brand', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'unit', name: 'unit', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'description', name: 'description', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'isActive', name: 'isActive', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  }

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService
  ) {}
  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');
  }
  permission(status: string) {
    this.permissions = {
      add_new_product: this.permissionService.canAccess(Item, 'add_new_product', status)
    };
  }

  async loadData() {
    this.isLoading = true;
    if (this.searchValue != null) {
      this.dataTableInputProductModel.search.value = this.searchValue;
    }
    try {
      const data = await firstValueFrom(this.itemService.data_table_main(this.dataTableInputProductModel));
      this.itemModel = data.data as ItemModel[];
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

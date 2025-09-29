import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {DecimalPipe, NgTemplateOutlet} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FilterMetadata, PrimeTemplate, SortEvent} from 'primeng/api';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Dialog} from 'primeng/dialog';
import {ItemModel} from '../image.library/item.library.model';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {ItemService} from '../item.library/item.service';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {CategoryCreate} from './category-create/category-create';
import {CategoryEdit} from './category-edit/category-edit';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-categories',
  imports: [
    Button,
    ButtonDirective,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Dialog,
    NgTemplateOutlet,
    CategoryEdit,
    CategoryCreate,
    Card
  ],
  templateUrl: './categories.html',
  standalone: true,
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  @ViewChild('categoriesDialog') categoriesDialog!: Dialog;
  public permissions: Record<string, boolean> = {};

  showModalCreateCategory = false;
  activeChild: 'child1' | 'child2' | null = null;
  child1Header!: TemplateRef<any>;
  child2Header!: TemplateRef<any>;

  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  totalRecords: number = 0;
  searchValue: string | undefined;
  filters: TableFilterEvent = {};
  isLoading: boolean = true;

  categoryModel: ItemModel[] = [];
  dataTableInputCategoryModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 2, dir: 'desc'}],
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'skuCode', name: 'skuCode', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'barcode', name: 'barcode', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'name', name: 'name', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'brand', name: 'brand', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'category', name: 'category', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'unit', name: 'unit', searchable: false, orderable: false, search: {value: '', regex: false}},
      {
        data: 'defaultSalePrice',
        name: 'defaultSalePrice',
        searchable: false,
        orderable: false,
        search: {value: '', regex: false}
      },
      {
        data: 'description',
        name: 'description',
        searchable: false,
        orderable: false,
        search: {value: '', regex: false}
      },
      {data: 'isActive', name: 'isActive', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'insTime', name: 'insTime', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  }

  constructor(
    private directoryService: ItemService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.dateStart = new Date(1991, 0, 1);
    this.loadData().then(r => null);

    this.permission('null');
  }

  permission(status: string) {
    this.permissions = {
      add_new_category: this.permissionService.canAccess(Categories, 'add_new_category', status)
    };
  }

  async loadData() {
    this.isLoading = true;

    this.dataTableInputCategoryModel.columns.forEach((column) => {
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
      this.dataTableInputCategoryModel.search.value = this.searchValue;
    }

    const formattedDateStart = this.formatDate(this.dateStart);
    const formattedDateEnd = this.formatDate(this.dateEnd);
    const docDateColumn = this.dataTableInputCategoryModel.columns.find(column => column.data === 'createdAt');
    if (docDateColumn) {
      docDateColumn.search.value = `${formattedDateStart};${formattedDateEnd}`;
    }
    try {
      const data = await firstValueFrom(this.directoryService.data_table_main(this.dataTableInputCategoryModel));
      this.categoryModel = data.data as ItemModel[];
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

    const columnIndex = this.dataTableInputCategoryModel.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInputCategoryModel.order = [{column: columnIndex, dir: sortOrder}];
      this.loadData().then(() => null);
    }
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputCategoryModel.start || event.rows !== this.dataTableInputCategoryModel.length) {
      this.dataTableInputCategoryModel.start = event.first;
      this.dataTableInputCategoryModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  openChild(name: 'child1') {
    this.activeChild = name;
    this.showModalCreateCategory = true;
    this.categoriesDialog.maximize();
  }

  setChildHeader(header: TemplateRef<any>) {
    this.child1Header = header;
  }

  onClose() {
    this.showModalCreateCategory = false;
  }
  /***/

  /***/

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

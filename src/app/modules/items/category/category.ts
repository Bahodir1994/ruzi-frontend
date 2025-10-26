import {ChangeDetectorRef, Component} from '@angular/core';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {CategoryModel} from './category-model';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {CategoryService} from './category-service';
import {PermissionService} from '../../../service/validations/permission.service';
import {FilterMetadata, MenuItem, PrimeTemplate, SortEvent} from 'primeng/api';
import {finalize, firstValueFrom} from 'rxjs';
import {Button, ButtonDirective} from 'primeng/button';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {Card} from 'primeng/card';
import {Tag} from "primeng/tag";
import {HasRolesDirective} from 'keycloak-angular';
import {Panel} from 'primeng/panel';
import {MultiSelect} from 'primeng/multiselect';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {NgClass} from '@angular/common';
import {Divider} from 'primeng/divider';
import {FloatLabel} from 'primeng/floatlabel';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {ItemModel} from '../item/item-model';
import {dt} from '@primeuix/themes';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-category',
  imports: [
    Button,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Card,
    Tag,
    Dialog,
    HasRolesDirective,
    Menu,
    Ripple,
    NgClass,
    Divider,
    FloatLabel,
    ToggleSwitch,
    Tooltip,
  ],
  templateUrl: './category.html',
  standalone: true,
  styleUrl: './category.scss',
  providers: [CategoryService]
})
export class Category {
  menuVisible = false;
  actions: MenuItem[] = [];

  form!: FormGroup;
  showModalCategory = false;
  showModalSelectItem = false;
  loadingSelectItem = false;

  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  totalRecords: number = 0;
  searchValue: string | undefined;
  filters: TableFilterEvent = {};
  isLoading: boolean = true;

  totalRecordsItem: number = 0;
  searchValueItem: string | undefined;
  filtersItem: TableFilterEvent = {};
  isLoadingItem: boolean = true;

  categoryModel: CategoryModel[] = [];
  dataTableInputCategoryModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 2, dir: 'desc'}],
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'code', name: 'code', searchable: true, orderable: false, search: {value: '', regex: false}},
      {data: 'insTime', name: 'insTime', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  }

  itemModel: ItemModel[] = [];
  selectedItemModel: ItemModel[] = [];
  dataTableInputItemModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 1, dir: 'desc'}],
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'name', name: 'code', searchable: true, orderable: false, search: {value: '', regex: false}}
    ]
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.actions = [
      {
        label: 'Guruhni o`chirish',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
        command: () => this.delete()
      },
    ];

    this.dateStart = new Date(1991, 0, 1);
    this.loadDataTable().then(r => null);

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  async loadDataTable() {
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
    const docDateColumn = this.dataTableInputCategoryModel.columns.find(column => column.data === 'insTime');
    if (docDateColumn) {
      docDateColumn.search.value = `${formattedDateStart};${formattedDateEnd}`;
    }
    try {
      const data = await firstValueFrom(this.categoryService.data_table_main(this.dataTableInputCategoryModel));
      this.categoryModel = data.data as CategoryModel[];
      this.totalRecords = data.recordsTotal;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }
  async loadDataTableItem() {
    this.isLoadingItem = true;

    this.dataTableInputItemModel.columns.forEach((column) => {
      const columnFilters = (this.filtersItem as { [key: string]: FilterMetadata[] })[column.data];

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
    if (this.searchValueItem != null) {
      this.dataTableInputItemModel.search.value = this.searchValueItem;
    }

    try {
      const data = await firstValueFrom(this.categoryService.data_table_item(this.dataTableInputItemModel));
      this.itemModel = data.data as ItemModel[];
      this.totalRecordsItem = data.recordsTotal;
      this.cdr.detectChanges();
    } finally {
      this.isLoadingItem = false;
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

    this.loadDataTable().then(r => null);
  }
  onSort(event: SortEvent) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';

    const columnIndex = this.dataTableInputCategoryModel.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInputCategoryModel.order = [{column: columnIndex, dir: sortOrder}];
      this.loadDataTable().then(() => null);
    }
  }
  pageChange(event: any) {
    if (event.first !== this.dataTableInputCategoryModel.start || event.rows !== this.dataTableInputCategoryModel.length) {
      this.dataTableInputCategoryModel.start = event.first;
      this.dataTableInputCategoryModel.length = event.rows;
      this.loadDataTable().then(r => null);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  private delete() {

  }

  onSubmit() {
    if (this.form.invalid) return;

    this.selectedItemModel.forEach(value => {
      console.log(value.id);
    })

    const itemIds = this.selectedItemModel.map(item => item.id);
    const data = {
      ...this.form.value,
      items: itemIds
    }

    this.categoryService.create(data).subscribe({
      next: () => {
        this.loadDataTable().then(value => null);
        this.showModalSelectItem = false;
      }
    });
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuVisible = !this.menuVisible;
  }

  openSelectItem() {
    this.showModalSelectItem = true;
    this.loadDataTableItem().then(value => null)
  }

  getVisibleNames(): string {
    const names = this.selectedItemModel.map(i => i.name);
    const visible = names.slice(0, 3);
    return visible.join(', ');
  }

  getHiddenCount(): number {
    const total = this.selectedItemModel.length;
    return total > 3 ? total - 3 : 0;
  }
}

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {FilterMetadata, PrimeTemplate, SortEvent} from 'primeng/api';
import {firstValueFrom} from 'rxjs';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {DirectoryService} from '../../service/modules/directory/directory.service';
import {ProductModel} from './directory.model';
import {Button, ButtonDirective} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tag} from 'primeng/tag';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-directory',
  imports: [
    TabPanels,
    TabPanel,
    Tabs,
    TabList,
    Tab,
    Button,
    ButtonDirective,
    DatePicker,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Tag,
    DecimalPipe
  ],
  templateUrl: './directory.html',
  standalone: true,
  styleUrl: './directory.scss'
})
export class Directory implements OnInit{
  public permissions: Record<string, boolean> = {};

  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  totalRecords: number = 0;
  searchValue: string | undefined;
  filters: TableFilterEvent = {};
  isLoading: boolean = true;

  productModel: ProductModel[] = [];
  dataTableInputProductModel: DataTableInput = {
    draw: 0,
    start:0,
    length: 10,
    search:{value: '', regex: false},
    order: [{column: 2, dir: 'desc'}],
    columns:[
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'skuCode', name: 'skuCode', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'barcode', name: 'barcode', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'name', name: 'name', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'brand', name: 'brand', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'category', name: 'category', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'unit', name: 'unit', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'defaultSalePrice', name: 'defaultSalePrice', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'description', name: 'description', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'isActive', name: 'isActive', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  }

  constructor(
    private directoryService: DirectoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.dateStart = new Date(1991, 0, 1);
    this.loadData().then(r => null);
  }

  async loadData() {
    this.isLoading = true;

    this.dataTableInputProductModel.columns.forEach((column) => {
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
      this.dataTableInputProductModel.search.value = this.searchValue;
    }

    const formattedDateStart = this.formatDate(this.dateStart);
    const formattedDateEnd = this.formatDate(this.dateEnd);
    const docDateColumn = this.dataTableInputProductModel.columns.find(column => column.data === 'createdAt');
    if (docDateColumn) {
      docDateColumn.search.value = `${formattedDateStart};${formattedDateEnd}`;
    }

    try {
      const data = await firstValueFrom(this.directoryService.data_table_main(this.dataTableInputProductModel));

      this.productModel = data.data as ProductModel[];
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

    const columnIndex = this.dataTableInputProductModel.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInputProductModel.order = [{column: columnIndex, dir: sortOrder}];
      this.loadData().then(() => null);
    }
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputProductModel.start || event.rows !== this.dataTableInputProductModel.length) {
      this.dataTableInputProductModel.start = event.first;
      this.dataTableInputProductModel.length = event.rows;
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

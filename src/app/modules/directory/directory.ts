import {Component, OnInit} from '@angular/core';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {TableFilterEvent} from 'primeng/table';
import {FilterMetadata, SortEvent} from 'primeng/api';
import {filter} from 'rxjs';
import {DatePickerTokenSections} from '@primeuix/themes/types/datepicker';
import Date = DatePickerTokenSections.Date;
import Date = DatePickerTokenSections.Date;

@Component({
  selector: 'app-directory',
  imports: [
    TabPanels,
    TabPanel,
    Tabs,
    TabList,
    Tab
  ],
  templateUrl: './directory.html',
  standalone: true,
  styleUrl: './directory.scss'
})
export class Directory implements OnInit{
  totalRecords: number = 0;
  searchValue: string | undefined;
  filters: TableFilterEvent = {};
  isLoading: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
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

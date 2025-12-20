import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {CustomerModel} from './customer.model';
import {FormBuilder} from '@angular/forms';
import {CustomerService} from './customer.service';
import {firstValueFrom} from 'rxjs';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {HasRolesDirective} from 'keycloak-angular';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {DatePipe, DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Menu} from 'primeng/menu';
import {ItemModel} from '../../items/item/item-model';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-customer',
  imports: [
    Card,
    Button,
    HasRolesDirective,
    PrimeTemplate,
    NgOptimizedImage,
    TableModule,
    Menu,
    DatePipe,
    NgClass,
    Tag
  ],
  templateUrl: './customer.html',
  standalone: true,
  styleUrl: './customer.scss'
})
export class Customer implements OnInit {

  isLoading: boolean = true;
  searchValue: string | undefined;
  totalRecords: number = 0;

  customerModel: CustomerModel[] = [];
  customerModelSelected: CustomerModel[] = [];

  dataTableInput: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: { value: '', regex: false },

    order: [{ column: 0, dir: 'asc' }],  // fullName boyicha sort

    columns: [
      {
        data: 'fullName',
        name: 'fullName',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false }
      },

      {
        data: 'customerType',
        name: 'customerType',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false }
      },

      {
        data: 'phoneNumber',
        name: 'phoneNumber',
        searchable: true,
        orderable: false,
        search: { value: '', regex: false }
      },

      {
        data: 'tin',
        name: 'tin',
        searchable: true,
        orderable: false,
        search: { value: '', regex: false }
      },

      {
        data: 'region',
        name: 'region',
        searchable: true,
        orderable: false,
        search: { value: '', regex: false }
      },

      {
        data: 'companyName',
        name: 'companyName',
        searchable: true,
        orderable: false,
        search: { value: '', regex: false }
      },

      {
        data: 'insTime',
        name: 'insTime',
        searchable: false,
        orderable: true,   // sanaga ko‘ra sort bo‘ladi
        search: { value: '', regex: false }
      }
    ]
  };

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
  }

  getRowActions(row: ItemModel): MenuItem[] {
    return [
      {
        label: 'O‘chirish',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600 hover:bg-red-50',
        command: () => null
      }
    ];
  }


  async loadData() {
    this.isLoading = true;

    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }

    try {
      const res = await firstValueFrom(
        this.customerService.data_table_main(this.dataTableInput)
      );

      this.customerModel = res.data as CustomerModel[]

      this.totalRecords = res.recordsFiltered;
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

import {Component, OnInit} from '@angular/core';
import {ItemModel} from '../items/item/item-model';
import {DataTableInput} from '../../component/datatables/datatable-input.model';
import {CartSession} from '../cashbox/cashbox.model';
import {Card} from 'primeng/card';
import {DatePipe, DecimalPipe, NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Menu} from 'primeng/menu';
import {HasRolesDirective} from 'keycloak-angular';

@Component({
  selector: 'app-carts',
  imports: [
    Card,
    NgOptimizedImage,
    Button,
    InputText,
    FormsModule,
    Divider,
    IconField,
    InputIcon,
    TableModule,
    Tag,
    DecimalPipe,
    DatePipe,
    Menu,
    HasRolesDirective
  ],
  templateUrl: './carts.html',
  standalone: true,
  styleUrl: './carts.scss'
})
export class Carts implements OnInit {

  showCreateCartModal = false;

  /* -----------------------------------------------------------------------------
 *  MAIN TABLE DATA
 * ----------------------------------------------------------------------------- */
  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  cartSessionModel: CartSession[] = [];
  cartSessionSelectedModel: CartSession[] = [];
  dataTableInputCartSessionModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: { value: '', regex: false },
    order: [{ column: 1, dir: 'desc' }],  // insTime bo‘yicha desc
    columns: [
      { data: 'id', name: 'id', searchable: false, orderable: false, search: { value: '', regex: false }},

      { data: 'insTime', name: 'insTime', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'cartNumber', name: 'cartNumber', searchable: true, orderable: false, search: { value: '', regex: false }},

      { data: 'paymentType', name: 'paymentType', searchable: true, orderable: false, search: { value: '', regex: false }},

      { data: 'paymentStatus', name: 'paymentStatus', searchable: true, orderable: false, search: { value: '', regex: false }},

      { data: 'status', name: 'status', searchable: true, orderable: false, search: { value: '', regex: false }},

      { data: 'totalAmount', name: 'totalAmount', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'paidAmount', name: 'paidAmount', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'debtAmount', name: 'debtAmount', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'createdByUser', name: 'createdByUser', searchable: true, orderable: false, search: { value: '', regex: false }},

      { data: 'createdAt', name: 'createdAt', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'closedAt', name: 'closedAt', searchable: false, orderable: true, search: { value: '', regex: false }},

      { data: 'isDeleted', name: 'isDeleted', searchable: false, orderable: false, search: { value: '', regex: false }}
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  newCart = {
    cartNumber: ''
  };

  /* =====================================================================================
 *  TABLE PAGINATION
 * ===================================================================================== */
  pageChange(event: any) {
    if (event.first !== this.dataTableInputCartSessionModel.start ||
      event.rows !== this.dataTableInputCartSessionModel.length) {

      this.dataTableInputCartSessionModel.start = event.first;
      this.dataTableInputCartSessionModel.length = event.rows;

      this.loadData();
    }
  }

  private loadData() {

  }
}

import {ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {ItemService} from './item.service';
import {PermissionService} from '../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {ItemModel} from './item-model';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {Button} from 'primeng/button';
import {DecimalPipe, NgIf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {HasRolesDirective} from 'keycloak-angular';
import {Select} from 'primeng/select';
import {SelectButton} from 'primeng/selectbutton';
import {Textarea} from 'primeng/textarea';
import {FloatLabel} from 'primeng/floatlabel';
import {ScrollPanel} from 'primeng/scrollpanel';
import {AnimateOnScroll} from 'primeng/animateonscroll';
import {InputMask} from 'primeng/inputmask';
import {InputNumber} from 'primeng/inputnumber';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {IftaLabel} from 'primeng/iftalabel';

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
    InputText,
    HasRolesDirective,
    ReactiveFormsModule,
    Select,
    SelectButton,
    Textarea,
    FloatLabel,
    ScrollPanel,
    NgIf,
    InputMask,
    InputNumber,
    InputGroup,
    InputGroupAddon,
    IftaLabel,
  ],
  templateUrl: './item.html',
  standalone: true,
  styleUrl: './item.scss',
  encapsulation: ViewEncapsulation.None
})
export class Item {
  showFloatingTitle = false;
  itemTypeOption = [
    { icon: 'cutlery.png', id: '001', label: 'Oziq-ovqat maxsulotlari' },
    { icon: 'web-maintenance.png', id: '002', label: 'Qurilish materiallari' },
    { icon: 'cutlery.png', id: '003', label: 'Elektronika tovarlari' },
    { icon: 'web-maintenance.png', id: '004', label: 'Kiyim-Kechak maxsulotlari' },
    { icon: 'cutlery.png', id: '005', label: 'Tibbiyot maxsulotlari' },
    { icon: 'web-maintenance.png', id: '005', label: 'XOZ tovarlar' },
  ];

  categoryOptions = [
    { id: '1111-aaaa', label: 'Elektronika' },
    { id: '2222-bbbb', label: 'Aksessuarlar' },
  ];

  unitOptions = [
    { label: 'dona', value: 'dona' },
    { label: 'kg', value: 'kg' },
    { label: 'l', value: 'l' },
  ];

  activeOptions = [
    { label: 'Aktiv', value: 'true' },
    { label: 'Nofaol', value: 'false' },
  ];

  public permissions: Record<string, boolean> = {};
  visibleProductModal = false;
  form!: FormGroup;

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
    private fb: FormBuilder,
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(600)]],
      price: [undefined],
      categoryId: ['', Validators.required],
      isActive: ['true'],
      primaryImageUrl: [''],
      skuCode: ['', Validators.required],
      barcode: [''],
      brand: [''],
      unit: [''],
      description: [''],
    });

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

  get f() {
    return this.form.controls;
  }

  onSubmit() {

  }
}

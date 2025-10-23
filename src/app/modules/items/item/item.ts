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
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
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
import {RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {Panel} from 'primeng/panel';
import {Badge} from 'primeng/badge';
import {FileUpload} from 'primeng/fileupload';
import {PrimeNG} from 'primeng/config';
import {Checkbox} from 'primeng/checkbox';
import {MultiSelect} from 'primeng/multiselect';

type GalleryItem = { id: string; url: string; name: string; createdAt: string };

interface Actions {
  name: string,
  code: string
}

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
    FloatLabel,
    ScrollPanel,
    InputNumber,
    RouterLink,
    ButtonDirective,
    ButtonLabel,
    Panel,
    FileUpload,
    Checkbox,
    MultiSelect
  ],
  templateUrl: './item.html',
  standalone: true,
  styleUrl: './item.scss',
  encapsulation: ViewEncapsulation.None
})
export class Item {
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

  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;

  public permissions: Record<string, boolean> = {};

  visibleProductModal = false;
  noCloseDialogOnSave = false
  actions!: Actions[];
  selectedActions!: Actions[];

  form!: FormGroup;
  formCreateItemSubmit = false;

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
    private config: PrimeNG,
    private fb: FormBuilder,
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.permission('null');
    this.actions = [
      {name: 'Saqlangach oynani yopma!', code: 'NY'},
      {name: 'Saqlangach maydonlarni tozala!', code: 'RM'}
    ];

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

  get hasNY(): boolean {
    return this.selectedActions?.some(a => a.code === 'NY') ?? false;
  }
  disableIfPrereqMissing = (opt: any): boolean => {
    return opt.code === 'RM' && !this.hasNY;
  };
  onActionsChange() {
    if (!this.hasNY) {
      this.selectedActions = (this.selectedActions ?? []).filter(a => a.code !== 'RM');
    }
  }
  openDialog() {
    this.visibleProductModal = true;
  }

  galleryAll: GalleryItem[] = [
    // demo ma'lumotlar (backenddan olasiz)
    { id: '1', url: '/assets/demo/food1.jpg', name: 'caesar_salad.png', createdAt: '2025-08-18' },
    { id: '2', url: '/assets/demo/steak.png',        name: 'steak.png',        createdAt: '2025-08-18' },
    { id: '3', url: '/assets/demo/burger.png',       name: 'burger.png',       createdAt: '2025-08-18' },
  ];
  galleryFiltered: GalleryItem[] = [...this.galleryAll];
  gallerySelected: GalleryItem[] = []; // tanlangan (UIga qo'shilgan) rasmlar
  picked = new Set<string>();          // dialog ichida vaqtinchalik tanlangan

  galleryVisible = false;
  galleryQuery = '';
  sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'A → Z',  value: 'az'     },
    { label: 'Z → A',  value: 'za'     },
  ];
  sortValue: 'newest'|'oldest'|'az'|'za' = 'newest';

  // ---- FILEUPLOAD HANDLERS ----
  onSelect(e: any) {
    // bu yerda faqat preview ko'rsatiladi; uploadni keyin o'zingiz API bilan qilasiz
    // e.files — p-fileupload ichidagi local fayllar
  }
  onUpload(e: any) {
    // kerak bo'lsa backendga yuborasiz (FormData bilan)
    // const form = new FormData();
    // for (const f of e.files) form.append('files', f, f.name);
    // this.http.post('/api/upload', form).subscribe();
  }
  onRemoveFile(file: any, index: number, removeFileCallback: (index: number) => void) {
    removeFileCallback(index);
  }
  // ---- GALLERY DIALOG ----
  openGallery() {
    this.picked.clear();
    this.galleryQuery = '';
    this.galleryFiltered = [...this.galleryAll];
    this.sortValue = 'newest';
    this.galleryVisible = true;
  }
  filterGallery() {
    const q = this.galleryQuery.trim().toLowerCase();
    const base = [...this.galleryAll];
    this.galleryFiltered =
      q ? base.filter(x => x.name.toLowerCase().includes(q)) : base;
    this.sortGallery();
  }
  sortGallery() {
    const arr = [...this.galleryFiltered];
    switch (this.sortValue) {
      case 'newest': arr.sort((a,b)=> b.createdAt.localeCompare(a.createdAt)); break;
      case 'oldest': arr.sort((a,b)=> a.createdAt.localeCompare(b.createdAt)); break;
      case 'az':     arr.sort((a,b)=> a.name.localeCompare(b.name)); break;
      case 'za':     arr.sort((a,b)=> b.name.localeCompare(a.name)); break;
    }
    this.galleryFiltered = arr;
  }
  togglePick(id: string) {
    this.picked.has(id) ? this.picked.delete(id) : this.picked.add(id);
  }
  applyPicked() {
    const toAdd = this.galleryAll.filter(x => this.picked.has(x.id));
    // dublikat bo'lmasin
    const existing = new Set(this.gallerySelected.map(x => x.id));
    toAdd.forEach(x => { if (!existing.has(x.id)) this.gallerySelected.push(x); });
    this.galleryVisible = false;
  }
  removeFromGallery(id: string) {
    this.gallerySelected = this.gallerySelected.filter(x => x.id !== id);
  }
  // "Upload new images" — dialogdan ham fayl tanlatish (p-fileupload ni trigger qilish)
  triggerFileFromDialog() {
    this.galleryVisible = false; // ixtiyoriy
    // UI'da mavjud file inputni topib click qilish mumkin,
    // lekin PrimeNG ichki inputiga ko'rinadigan ref yo'q.
    // Soddaroq yo'l: yuqoridagi drag&drop zonani bosishga yo'naltiring.
    // (Agar xohlasangiz ViewChild bilan ichki input'ni ham topib bosish mumkin.)
  }

  choose(event: any, callback: () => void) {
    callback();
  }
  onRemoveTemplatingFile(event: any, file: { size: any; }, removeFileCallback: (arg0: any, arg1: any) => void, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }
  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }
  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
  }
  uploadEvent(callback: () => void) {
    callback();
  }
  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes ? sizes : [0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes ? sizes : [i]}`;
  }

  async onSubmit() {
    this.formCreateItemSubmit = true;

    const result = await firstValueFrom(this.itemService.create_item(this.form.value));
    if (result.success) {
      this.formCreateItemSubmit = true;
      this.loadData()
      this.visibleProductModal = false;
    }
  }
}

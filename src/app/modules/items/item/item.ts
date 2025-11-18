import {ChangeDetectorRef, Component, signal, ViewChild, ViewEncapsulation} from '@angular/core';
import {TableModule} from 'primeng/table';
import {DataTableInput} from '../../../component/datatables/datatable-input.model';
import {ItemService} from './item.service';
import {firstValueFrom} from 'rxjs';
import {ErrorResponse, ItemModel} from './item-model';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {DecimalPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Tag} from 'primeng/tag';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {HasRolesDirective} from 'keycloak-angular';
import {Select} from 'primeng/select';
import {SelectButton} from 'primeng/selectbutton';
import {FloatLabel} from 'primeng/floatlabel';
import {ScrollPanel} from 'primeng/scrollpanel';
import {InputNumber} from 'primeng/inputnumber';
import {RouterLink} from '@angular/router';
import {Panel} from 'primeng/panel';
import {MultiSelect} from 'primeng/multiselect';
import {Tooltip} from 'primeng/tooltip';
import {Checkbox} from 'primeng/checkbox';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Ripple} from 'primeng/ripple';
import {DocumentDto} from '../image/image.model';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {ImageService} from '../image/image.service';
import {Divider} from 'primeng/divider';
import {FormStateService} from '../../../service/states/form-state.service';
import {CategoryService} from '../category/category-service';
import {CategoryModel} from '../category/category-model';
import {UnitService} from '../unit/unit-service';
import {UnitModel} from '../unit/unit-model';
import {ImageFallbackDirective} from '../../../configuration/directives/image.fallback';
import {Card} from 'primeng/card';
import {Actionbar} from '../../../component/actionbar/actionbar';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {environment} from '../../../../environments/environment';
import {SplitButton} from 'primeng/splitbutton';
import {FileUpload, FileUploadHandlerEvent} from 'primeng/fileupload';
import {ProgressBar} from 'primeng/progressbar';

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
    MultiSelect,
    NgOptimizedImage,
    Tooltip,
    Checkbox,
    ProgressSpinner,
    Ripple,
    Divider,
    NgClass,
    ImageFallbackDirective,
    Card,
    Actionbar,
    Menu,
    FileUpload,
    ProgressBar
  ],
  templateUrl: './item.html',
  standalone: true,
  styleUrl: './item.scss',
  encapsulation: ViewEncapsulation.None
})
export class Item {
  @ViewChild('dialog') dialog!: Dialog;
  @ViewChild('fu') fileUploadXlsx: FileUpload | undefined;
  shouldMaximize = false;

  loading: boolean = false;
  progress: number = 0;

  errorResponse: ErrorResponse[] = []
  uploadedFiles: any[] = [];
  uploadedFileXlsx: any[] = [];

  bottomBarVisible = signal(false);
  menuVisible = false;
  activeOptions = [
    {label: 'Aktiv', value: 'true'},
    {label: 'NoAktiv', value: 'false'},
  ];

  editingId!: string | null;
  isAdding = false;
  newItem = {name: '', price: undefined as number | undefined};

  files = [];
  categoryOptions!: CategoryModel[] | [];
  unitOptions!: UnitModel[] | [];

  dialogVisibleXlsxErrors: boolean = false;
  showModalImportItem = false;
  showModalSelectImage = false;
  showItemModal = false;
  actions!: MenuItem[];
  selectedActions!: MenuItem[];

  form!: FormGroup;
  formCreateItemSubmit = false;

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  imagePathPrefix = environment.minioThumbUrl;
  searchQuery = '';
  selectedSort: any;
  sortOptions = [
    {label: 'A–Z bo‘yicha', value: 'az'},
    {label: 'Z–A bo‘yicha', value: 'za'},
    {label: 'Sana bo‘yicha (oxirgisi birinchi)', value: 'date'}
  ];
  filteredImages: DocumentDto[] = [];
  imagesList: DocumentDto[] = [];
  selectedImages: any[] = [];
  isLoadingImage: boolean = true;

  itemModel: ItemModel[] = [];
  itemSelectedModel: ItemModel[] = [];
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
    private imageService: ImageService,
    private categoryService: CategoryService,
    private unitService: UnitService,
    private fb: FormBuilder,
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
    private formStateService: FormStateService
  ) {
  }

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.readCategoryList();
    this.readUnitList();
    this.actions = [
      {name: 'Saqlangach oynani yopma!', id: 'NY'},
      {name: 'Saqlangach maydonlarni tozala!', id: 'RM'}
    ];

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(600)]],
      price: [undefined],
      categoryId: ['', Validators.minLength(5)],
      isActive: ['true'],
      primaryImageUrl: [''],
      skuCode: ['', Validators.required],
      barcode: [''],
      brand: [''],
      unit: [''],
      description: [''],
    });

    this.formStateService.setForm(this.form);
    this.form.updateValueAndValidity();
  }

  getRowActions(row: ItemModel): MenuItem[] {
    return [
      {
        label: 'O‘chirish',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600 hover:bg-red-50',
        command: () => this.onDeleteRow(row)   // <-- item bor
      },
      {
        label: 'Tahrirlash',
        icon: 'pi pi-pencil',
        command: () => {
          this.openEditItem(row);
          this.shouldMaximize = true;
          this.showItemModal = true;
        }
      }
    ];
  }

  getGroupAction() : MenuItem[] {
    return [
      {
        label: 'O`chirish',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600 hover:bg-red-50 hover:text-red-700 border-b dark:hover:bg-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
        command: () => this.onDeleteSelected()
      }
    ];
  }

  getExcelBtnAction() : MenuItem[] {
    return [
      {
        label: 'Na`muna Excel yuklab olish',
        icon: 'pi pi-download',
        command: () => this.showModalImportItem = true
      }
    ];
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

  async onSubmit() {
    this.formCreateItemSubmit = true;
    if (this.form.invalid) return;

    const primaryImageUrl =
      this.selectedImages.length > 0
        ? `${this.selectedImages[0].parentId}/${this.selectedImages[0].docName}`
        : null;

    const data = {
      ...this.form.value,
      primaryImageUrl
    }

    if (this.editingId) {
      // UPDATE LISIT
      this.itemService.update_item(this.editingId, data).subscribe({
        next: () => {
          this.loadData();
          this.showItemModal = false;
          this.editingId = null;
        }
      });
    } else {
      // CREATE LISTI
      this.itemService.create_item(data).subscribe({
        next: () => {
          this.loadData();
          this.showItemModal = false;
        }
      });
    }

  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInputProductModel.start || event.rows !== this.dataTableInputProductModel.length) {
      this.dataTableInputProductModel.start = event.first;
      this.dataTableInputProductModel.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  onActionsChange() {
    if (!this.hasNY) {
      this.selectedActions = (this.selectedActions ?? []).filter(a => a.id !== 'RM');
    }
  }

  toggleSelection(img: any) {
    const isSelected = this.isSelected(img);

    // Agar shu rasm allaqachon tanlangan bo‘lsa — uni tozalaymiz
    if (isSelected) {
      this.selectedImages = [];
    }
    // Aks holda, avvalgi tanlovni tozalab, faqat bitta rasmni tanlaymiz
    else {
      this.selectedImages = [img];
    }

    this.cdr.detectChanges();
  }

  isSelected(img: any): boolean {
    return this.selectedImages.some((i) => i.id === img.id);
  }

  openSelectImage() {
    this.showModalSelectImage = true;
    this.readImageList();
  }

  readImageList() {
    this.isLoadingImage = true;

    this.imageService.read().subscribe({
      next: (res: ResponseDto) => {
        if (res.success) {
          this.isLoadingImage = false
          this.imagesList = res.data as DocumentDto[];
          this.applyFilters();
          this.cdr.detectChanges();
        }
      }
    });
  }

  readCategoryList() {
    this.categoryService.category_list().subscribe({
      next: value => {
        this.categoryOptions = value.data as CategoryModel[];
        this.cdr.detectChanges()
      }
    })
  }

  readUnitList() {
    this.unitService.unit_list().subscribe({
      next: value => {
        this.unitOptions = value.data as UnitModel[];
        this.cdr.detectChanges()
      }
    })
  }

  startAddRow() {
    this.isAdding = true;
  }

  cancelAddRow() {
    this.isAdding = false;
    this.newItem = {name: '', price: undefined};
  }

  saveNewItem() {
    if (!this.newItem.name || this.newItem.price == null) {
      alert('Mahsulot nomi va narxini kiriting!');
      return;
    }

    const newRow = {
      name: this.newItem.name.trim(),
      price: this.newItem.price ?? 0,
      isActive: true,
    };


    this.itemService.create_item_simple(newRow).subscribe({
      next: () => {
        this.loadData();
        this.cancelAddRow();
      }
    });
  }

  onDeleteRow(row: ItemModel) {
    this.itemService.delete_item(row.id).subscribe({
      next: () => {

        // ❗ 1) Agar row tanlangan bo‘lsa — tanlanganlar ro‘yxatidan o‘chiramiz
        this.itemSelectedModel = this.itemSelectedModel.filter(i => i.id !== row.id);

        // ❗ 2) bottomBarVisible ni qayta hisoblaymiz
        this.onTableSelectionChange(this.itemSelectedModel);

        // ❗ 3) table ma’lumotlarini qayta yuklaymiz
        this.loadData();
      }
    });
  }

  onDeleteSelected() {
    const ids = this.itemSelectedModel.map(i => i.id);

    this.itemService.delete_items_bulk(ids).subscribe({
      next: () => {
        this.itemSelectedModel = [];
        this.loadData();
      }
    });
  }

  applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();
    let list = [...this.imagesList];

    if (query) {
      list = list.filter(img => (img.docName ?? '').toLowerCase().includes(query));
    }

    switch (this.selectedSort?.value) {
      case 'az':
        list.sort((a, b) => (a.docName ?? '').localeCompare(b.docName ?? ''));
        break;

      case 'za':
        list.sort((a, b) => (b.docName ?? '').localeCompare(a.docName ?? ''));
        break;

      case 'date':
        list.sort((a, b) => {
          const da = new Date(a.fileDate ?? '').getTime();
          const db = new Date(b.fileDate ?? '').getTime();
          return db - da;
        });
        break;
    }

    this.filteredImages = list;
  }

  get hasNY(): boolean {
    return this.selectedActions?.some(a => a.id === 'NY') ?? false;
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuVisible = !this.menuVisible;
  }

  onTableSelectionChange(selected: any[]) {
    this.bottomBarVisible.set(selected.length > 0);
  }

  openEditItem(row: ItemModel) {
    // EDIT MODE FLAG qo‘shamiz
    this.editingId = row.id;
    this.showItemModal = true;

    this.selectedImages = [];

    this.form.patchValue({
      code: row.code,
      name: row.name,
      price: row.price,
      categoryId: '',
      isActive: row.isActive ? 'true' : 'false',
      primaryImageUrl: row.primaryImageUrl,
      skuCode: row.skuCode,
      barcode: row.barcode,
      brand: row.brand,
      unit: row.unit,
      description: row.description,
    });

    // Rasm bo‘lsa
    if (row.primaryImageUrl) {
      const [parentId, docName] = row.primaryImageUrl.split('/');
      this.selectedImages = [{parentId, docName}];
    }
  }

  onDialogShown() {
    if (this.shouldMaximize) {
      this.dialog.maximize();
      this.shouldMaximize = false;
    }
  }

  onModalClose() {
    this.selectedImages = [];
    this.editingId = null;
    this.form.reset();
  }

  onSaveFromExcel(event: FileUploadHandlerEvent) {
    this.loading = true;
    this.progress = 0;

    let files = event.files;
    for (let file of files) {
      this.itemService.create_item_xlsx(file)
        .subscribe({
          next: () => {
            setTimeout(() => {
              this.uploadedFileXlsx = [];
              this.fileUploadXlsx!.clear()
              this.loadData()
            }, 100);
            this.loading = false;
            this.progress = 100;
          },
          error: err => {
            this.errorResponse = err.error.data;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.dialogVisibleXlsxErrors = true;
            }, 1000);
          }
        });
    }
  }

  downloadExcel($event: PointerEvent, xlsx: string, assets: string) {
    return null;
  }
}

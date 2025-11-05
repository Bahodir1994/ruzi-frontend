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
    MultiSelect,
    NgOptimizedImage,
    Tooltip,
    Checkbox,
    ProgressSpinner,
    Ripple,
    Divider,
    NgClass,
    ImageFallbackDirective,
    Card
  ],
  templateUrl: './item.html',
  standalone: true,
  styleUrl: './item.scss',
  encapsulation: ViewEncapsulation.None
})
export class Item {
  activeOptions = [
    {label: 'Aktiv', value: 'true'},
    {label: 'Nofaol', value: 'false'},
  ];

  files = [];
  categoryOptions!: CategoryModel[] | [];
  unitOptions!: UnitModel[] | [];

  public permissions: Record<string, boolean> = {};

  showModalSelectImage = false;
  showItemModal = false;
  actions!: Actions[];
  selectedActions!: Actions[];

  form!: FormGroup;
  formCreateItemSubmit = false;

  totalRecords: number = 0;
  searchValue: string | undefined;
  isLoading: boolean = true;

  imagePathPrefix = 'http://localhost:9000/ruzi/thumb/';
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
  ) {}

  ngOnInit(): void {
    this.loadData().then(r => null);
    this.readCategoryList();
    this.readUnitList();
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

    this.formStateService.setForm(this.form);
    this.form.updateValueAndValidity();
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

    this.itemService.create_item(data).subscribe({
      next: () => {
        this.loadData()
        this.showItemModal = false;
      }
    });
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
      this.selectedActions = (this.selectedActions ?? []).filter(a => a.code !== 'RM');
    }
  }
  openDialog() {
    this.showItemModal = true;
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
    return this.selectedActions?.some(a => a.code === 'NY') ?? false;
  }
}

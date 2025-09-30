import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {DecimalPipe, NgTemplateOutlet} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FilterMetadata, PrimeTemplate, SortEvent, TreeNode} from 'primeng/api';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Dialog} from 'primeng/dialog';
import {ItemModel} from '../../image.library/item.library.model';
import {DataTableInput} from '../../../../component/datatables/datatable-input.model';
import {ItemService} from '../../item.library/item.service';
import {PermissionService} from '../../../../service/validations/permission.service';
import {firstValueFrom} from 'rxjs';
import {CategoryCreate} from '../category-create/category-create';
import {CategoryEdit} from '../category-edit/category-edit';
import {Card} from 'primeng/card';
import {CategoriesService} from '../service-model/categories.service';
import {ResponseDto} from '../../../../configuration/resursurls/responseDto';
import {CategoryModel} from '../service-model/categories.model';
import {TreeTableModule} from 'primeng/treetable';

@Component({
  selector: 'app-categories',
  imports: [
    Button,
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
    Card,
    TreeTableModule
  ],
  templateUrl: './categories.html',
  standalone: true,
  styleUrl: './categories.scss',
  providers: [CategoriesService]
})
export class Categories implements OnInit {
  @ViewChild('categoriesDialog') categoriesDialog!: Dialog;
  public permissions: Record<string, boolean> = {};

  showModalCreateCategory = false;
  activeChild: 'child1' | 'child2' | null = null;
  child1Header!: TemplateRef<any>;
  child2Header!: TemplateRef<any>;


  categories!: CategoryModel[];
  categoriesTree: TreeNode[] = [];
  selectedCategoryTranslations: any[] = [];
  displayTranslations = false;

  dateStart: Date = new Date();
  dateEnd: Date = new Date();
  totalRecordsCategoryModel: number = 0;
  searchValueCategoryModel: string | undefined;
  filters: TableFilterEvent = {};
  isLoadingCategoryModel: boolean = true;
  categoryModel: CategoryModel[] = [];
  categoryModelSelectedList: CategoryModel[] = [];
  dataTableInputCategoryModel: DataTableInput = {
    draw: 0,
    start: 0,
    length: 10,
    search: {value: '', regex: false},
    order: [{column: 4, dir: 'desc'}],
    columns: [
      {data: 'id', name: 'id', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'code', name: 'code', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'parentId', name: 'parentId', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'primaryImageUrl', name: 'primaryImageUrl', searchable: false, orderable: false, search: {value: '', regex: false}},
      {data: 'insTime', name: 'insTime', searchable: false, orderable: false, search: {value: '', regex: false}}
    ]
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.loadCategoryTreeWithItem()
    this.permission('null');
  }

  permission(status: string) {
    this.permissions = {
      add_new_category: this.permissionService.canAccess(Categories, 'add_new_category', status)
    };
  }

  async loadDataCategoryModel() {
    this.isLoadingCategoryModel = true;

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
    if (this.searchValueCategoryModel != null) {
      this.dataTableInputCategoryModel.search.value = this.searchValueCategoryModel;
    }

    const formattedDateStart = this.formatDate(this.dateStart);
    const formattedDateEnd = this.formatDate(this.dateEnd);
    const docDateColumn = this.dataTableInputCategoryModel.columns.find(column => column.data === 'createdAt');
    if (docDateColumn) {
      docDateColumn.search.value = `${formattedDateStart};${formattedDateEnd}`;
    }
    try {
      const data = await firstValueFrom(this.categoriesService.data_table_category(this.dataTableInputCategoryModel));
      this.categoryModel = data.data as CategoryModel[];
      this.totalRecordsCategoryModel = data.recordsFiltered;
      this.cdr.detectChanges();
    } finally {
      this.isLoadingCategoryModel = false;
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

    this.loadDataCategoryModel().then(r => null);
  }
  onSort(event: SortEvent) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';

    const columnIndex = this.dataTableInputCategoryModel.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInputCategoryModel.order = [{column: columnIndex, dir: sortOrder}];
      this.loadDataCategoryModel().then(() => null);
    }
  }
  pageChange(event: any) {
    if (event.first !== this.dataTableInputCategoryModel.start || event.rows !== this.dataTableInputCategoryModel.length) {
      this.dataTableInputCategoryModel.start = event.first;
      this.dataTableInputCategoryModel.length = event.rows;
      this.loadDataCategoryModel().then(r => null);
    }
  }

  /* elements for create dialog category */
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
  loadCategoryTreeWithItem() {
    this.categoriesService.readCategoryTreeWidthItem().subscribe((res: ResponseDto) => {
      if (res.success) {
        const flatList = res.data as CategoryModel[];
        this.categoriesTree = this.buildTreeWithItems(flatList);
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 3);
      }
    });
  }
  loadCategoryTree() {
    this.categoriesService.readCategoryTree().subscribe((res: ResponseDto) => {
      if (res.success) {
        const flatList = res.data as CategoryModel[];
        this.categoriesTree = this.buildTreeFromNested(flatList);
        this.cdr.detectChanges();
      }
    });
  }

  /***/
  buildTreeWithItems(categories: CategoryModel[]): TreeNode[] {
    return categories.map(cat => {
      const categoryNode: TreeNode = {
        data: { id: cat.id, code: cat.code, parentId: cat.parentId, itemCount: cat.items ? cat.items.length : 0 },
        expanded: false,
        children: [],
      };

      if (cat.items && cat.items.length > 0) {
        const itemNodes: TreeNode[] = cat.items.map(item => ({
          data: { id: item.id, code: item.name, parentId: cat.id },
          leaf: true
        }));
        categoryNode.children = [...categoryNode.children!, ...itemNodes];
      }

      if (cat.children && cat.children.length > 0) {
        categoryNode.children = [
          ...categoryNode.children!,
          ...this.buildTreeWithItems(cat.children)
        ];
      }

      return categoryNode;
    });
  }
  buildTreeFromNested(categories: CategoryModel[]): TreeNode[] {
    this.categoriesTree = categories.map(cat => ({
      data: { id: cat.id, code: cat.code, parentId: cat.parentId },
      children: cat.children ? this.buildTreeFromNested(cat.children) : [],
      expanded: false
    }));

    console.log(this.categoriesTree);
    return this.categoriesTree;
  }

  /**/
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

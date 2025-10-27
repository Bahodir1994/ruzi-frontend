import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {CategoryModel} from './category-model';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';
import {ItemModel} from '../item/item-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* crud */
  category_list(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('category', 'category_list').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  update(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('category', 'update_category').pipe(
      switchMap(value => {
        if (!value) throw new Error('URL не был получен');
        this.moduleUrl = value;

        return this.http.patch<ResponseDto>(
          `${this.moduleUrl.host}${this.moduleUrl.url}`,
          formData
        );
      })
    );
  }

  create(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('category', 'create_category').pipe(
      switchMap(value => {
        if (!value) throw new Error('URL не был получен');
        this.moduleUrl = value;

        return this.http.post<ResponseDto>(
          `${this.moduleUrl.host}${this.moduleUrl.url}`,
          formData
        );
      })
    );
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<CategoryModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('category', 'category_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<CategoryModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

  data_table_item(dataTableInput: DataTableInput): Observable<DataTableOutput<ItemModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<ItemModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

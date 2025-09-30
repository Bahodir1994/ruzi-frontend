import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../../configuration/resursurls/apiConfig.service';
import {Observable, switchMap} from 'rxjs';
import {ResponseDto} from '../../../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';
import {DataTableInput, DataTableOutput} from '../../../../component/datatables/datatable-input.model';
import {CategoryModel} from './categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  readCategoryTreeWidthItem(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('category', 'read_category_width_item').pipe(
      switchMap(urlConfig => {
        if (urlConfig) {
          this.moduleUrl = urlConfig;
          return this.http.get<ResponseDto>(this.moduleUrl.host + this.moduleUrl.url);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  readCategoryTree(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('category', 'read_category_tree').pipe(
      switchMap(urlConfig => {
        if (urlConfig) {
          this.moduleUrl = urlConfig;
          return this.http.get<ResponseDto>(this.moduleUrl.host + this.moduleUrl.url);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  /* table */
  data_table_category(dataTableInput: DataTableInput): Observable<DataTableOutput<CategoryModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('category', 'read_category_self').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<CategoryModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

}

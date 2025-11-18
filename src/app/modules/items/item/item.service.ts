import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {ItemModel} from './item-model';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* -Methods- */
  create_item(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_create').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(this.moduleUrl.host + this.moduleUrl.url, formData);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  create_item_simple(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_create_simple').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(this.moduleUrl.host + this.moduleUrl.url, formData);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  delete_item(id: string | number): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_delete_one').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  delete_items_bulk(ids: (string | number)[]): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_delete_many').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(
            `${this.moduleUrl.host}${this.moduleUrl.url}`,
            { ids: ids }
          );
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  update_item(id: string, formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_update').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.put<ResponseDto>(
            `${this.moduleUrl.host}${this.moduleUrl.url}/${id}`,
            formData
          );
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  create_item_xlsx(file: File) {
    const formData = new FormData();

    formData.append("multipartFile", file);
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_create_xlsx').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, formData);
        } else {
          throw new Error('URL не был получен');
        }
      })
    )
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<ItemModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('items', 'item_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<ItemModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

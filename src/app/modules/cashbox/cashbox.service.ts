import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../component/datatables/datatable.service';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {AddCartItemDto, StockView, UpdateCartItemDto} from './cashbox.model';
import {ResponseDto} from '../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CashboxService {

  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  /* -crud- */
  create_cart(dto?: any): Observable<ResponseDto> {
    const payload = dto ?? {};
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'create_cart').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, payload);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  add_item(dto: AddCartItemDto): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'add_item').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, dto);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  update_item(dto: UpdateCartItemDto): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'update_item').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, dto);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  get_item(id: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'get_item').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  get_customers(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('customer', 'get_customers').pipe(
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

  delete_item(id: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'delete_item').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  delete_cart(id: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'delete_cart').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  cancel_cart(id: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'cancel_cart').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<StockView>> {
    this.apiConfigService.loadConfigAndGetResultUrl('stock', 'stock_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<StockView>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

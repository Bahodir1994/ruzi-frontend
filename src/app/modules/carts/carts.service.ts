import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {DatatableService} from '../../component/datatables/datatable.service';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {CartSession} from './carts.model';
import {ResponseDto} from '../../configuration/resursurls/responseDto';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  data_table_card_main(dataTableInput: DataTableInput): Observable<DataTableOutput<CartSession>> {
    this.apiConfigService.loadConfigAndGetResultUrl('cart', 'cart_table_main').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    });

    return this.datatableService.getDataForCart<DataTableOutput<CartSession>>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

  data_table_card(dataTableInput: DataTableInput): Observable<DataTableOutput<CartSession>> {
    this.apiConfigService.loadConfigAndGetResultUrl('cart', 'cart_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    });

    return this.datatableService.getDataForCart<DataTableOutput<CartSession>>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

  getStatistics(period: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'get_stats').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, {
            params: {
              period: period
            }
          });
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  get_item(id: string | null): Observable<ResponseDto> {
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

  get_payment(id: string | null): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'get_pay').pipe(
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

  get_customer(id: string | null): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('customer', 'get_customer_by_id').pipe(
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

  get_referrer(id: string | null): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('referrer', 'get_referrers_by_id').pipe(
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
}

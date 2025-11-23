import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {PurchaseOrderItemModel, PurchaseOrderModel} from './purchase-order.model';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  /* -CRUD- */
  create_order(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'pur_order_create').pipe(
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

  read_order(id: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'pur_order_read').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${id}`);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  read_supplier(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('supplier', 'get_suppliers').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  read_warehouse(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('warehouse', 'get_warehouses').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.get<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`);
        } else {
          throw new Error('ERROR9999');
        }
      })
    );
  }

  update_order(id: string, formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'update_pur_order').pipe(
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

  search_items(query: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('items', 'search_item').pipe(

      switchMap(config => {
        if (!config) throw new Error('ERROR9999');

        const url = `${config.host}${config.url}?query=${encodeURIComponent(query)}`;
        return this.http.get<ResponseDto>(url);
      })
    );
  }

  add_item_to_order(formData: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'add_item').pipe(
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

  update_item_field(payload: { id: string; field: string; value: any }): Observable<ResponseDto> {
    return this.apiConfigService
      .loadConfigAndGetResultUrl('purchase-order', 'update_pur_order_item')
      .pipe(
        switchMap(config => {
          if (!config) throw new Error('ERROR9999');

          const url = `${config.host}${config.url}/${payload.id}`;

          return this.http.patch<ResponseDto>(url, {
            field: payload.field,
            value: payload.value
          });
        })
      );
  }

  delete_order(orderId: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'delete_order').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${orderId}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  delete_item_from_order(orderId: string, itemId: string): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'delete_order_item').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.delete<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/${orderId}/${itemId}`);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<PurchaseOrderModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'purchase_order_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<PurchaseOrderModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

  data_table_pur_item(dataTableInput: DataTableInput): Observable<DataTableOutput<PurchaseOrderItemModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'purchase_order_item_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<PurchaseOrderItemModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

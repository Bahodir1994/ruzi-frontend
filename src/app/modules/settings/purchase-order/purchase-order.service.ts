import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {PurchaseOrderModel} from './purchase-order.model';
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
    return this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'pur_create').pipe(
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

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<PurchaseOrderModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('purchase-order', 'purchase_order_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<PurchaseOrderModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

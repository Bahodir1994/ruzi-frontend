import {Injectable} from '@angular/core';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable} from 'rxjs';
import {PurchaseOrderModel} from '../purchase-order/purchase-order.model';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {CustomerModel} from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<CustomerModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('customer', 'customer_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<CustomerModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

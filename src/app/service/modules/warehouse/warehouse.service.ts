import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {Observable} from 'rxjs';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {PurchaseOrderModel} from '../../../modules/warehouse/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<PurchaseOrderModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('warehouse', 'purchase_order_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<PurchaseOrderModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

}

import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable} from 'rxjs';
import {PurchaseOrderModel} from '../../../modules/warehouse/warehouse.model';
import {ProductModel} from '../../../modules/main-directory/directory/directory.model';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<ProductModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('directory', 'product_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<ProductModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

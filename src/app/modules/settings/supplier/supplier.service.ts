import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable} from 'rxjs';
import {SupplierModel} from './supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<SupplierModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('supplier', 'supplier_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<SupplierModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

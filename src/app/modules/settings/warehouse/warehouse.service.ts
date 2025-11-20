import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable} from 'rxjs';
import {WarehouseModel} from './warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<WarehouseModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('warehouse', 'warehouse_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<WarehouseModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../component/datatables/datatable.service';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../component/datatables/datatable-input.model';
import {Observable} from 'rxjs';
import {ItemModel} from '../items/item/item-model';
import {StockView} from './cashbox.model';

@Injectable({
  providedIn: 'root'
})
export class CashboxService {

  private moduleUrl!: FindResultApiUrl;

  constructor(
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
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

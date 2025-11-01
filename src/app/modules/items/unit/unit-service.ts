import {Injectable} from '@angular/core';
import {FindResultApiUrl} from '../../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../../component/datatables/datatable.service';
import {ApiConfigService} from '../../../configuration/resursurls/apiConfig.service';
import {DataTableInput, DataTableOutput} from '../../../component/datatables/datatable-input.model';
import {Observable, switchMap} from 'rxjs';
import {ItemModel} from '../item/item-model';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  /* crud */
  unit_list(): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('units', 'unit_list').pipe(
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

  /* -tables- */
  data_table_main(dataTableInput: DataTableInput): Observable<DataTableOutput<ItemModel>> {
    this.apiConfigService.loadConfigAndGetResultUrl('units', 'unit_table').subscribe(value => {
      if (value) {
        this.moduleUrl = value;
      }
    })

    return this.datatableService.getData<ItemModel>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }
}

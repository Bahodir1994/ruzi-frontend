import { Injectable } from '@angular/core';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {HttpClient} from '@angular/common/http';
import {DatatableService} from '../../component/datatables/datatable.service';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {Observable, switchMap} from 'rxjs';
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

  get_carts(first: number, rows: number): Observable<any> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'get_carts').pipe(
      switchMap((value: FindResultApiUrl | null) => {
        if (!value) {
          throw new Error('API konfiguratsiyasi topilmadi');
        }

        this.moduleUrl = value;

        const fullUrl = `${this.moduleUrl.host}${this.moduleUrl.url}?first=${first}&rows=${rows}`;
        return this.http.get<any>(fullUrl);
      })
    );
  }


}

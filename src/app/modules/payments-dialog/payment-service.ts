import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CheckoutDto} from './payment.model';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';
import {DatatableService} from '../../component/datatables/datatable.service';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {Observable, switchMap} from 'rxjs';
import {ResponseDto} from '../../configuration/resursurls/responseDto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    private http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {
  }

  checkout(body: CheckoutDto) {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'checkout').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, body);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }


  getPayments(dto: any): Observable<ResponseDto> {
    return this.apiConfigService.loadConfigAndGetResultUrl('cart', 'add_pay').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, dto);
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

  printReceipt(cartId: string, printerIp: string) {
    return this.http.post(`/route-cart/print-receipt/${cartId}?printerIp=${printerIp}`, {});
  }
}

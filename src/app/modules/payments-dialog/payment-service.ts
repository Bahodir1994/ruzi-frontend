import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddPaymentDto, AddPaymentResultDto, CheckoutDto, CheckoutResultDto} from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private base = '/route-cart';

  constructor(private http: HttpClient) {
  }

  checkout(body: CheckoutDto) {
    return this.http.post<{ status: number; message: string; data: CheckoutResultDto }>(
      `${this.base}/checkout`,
      body
    );
  }

  addPayment(body: AddPaymentDto) {
    return this.http.post<{ status: number; message: string; data: AddPaymentResultDto }>(
      `${this.base}/pay`,
      body
    );
  }
}

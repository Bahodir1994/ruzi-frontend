import {Component} from '@angular/core';
import {HttpPageComponent} from '../../http-page/http-page.component';

@Component({
  selector: 'app-error-403',
  template: `
    <app-http-page
      code="401"
      title="Авторизациядан ўтмагансиз!"
      message="ЯААТ ойнасига ўтиб, қайта киришингиз лозим!."
    ></app-http-page>
  `,
  standalone: true,
  imports: [HttpPageComponent],
})
export class Error401Component {
}

import {Component} from '@angular/core';
import {HttpPageComponent} from '../../http-page/http-page.component';

@Component({
  selector: 'app-error-404',
  template: `
    <app-http-page
      code="404"
      title="Page not found!"
      message="This is not the web page you are looking for."
    ></app-http-page>
  `,
  standalone: true,
  imports: [HttpPageComponent],
})
export class Error404Component {
}

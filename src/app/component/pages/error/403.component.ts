import {Component} from '@angular/core';
import {HttpPageComponent} from '../../http-page/http-page.component';

@Component({
  selector: 'app-error-403',
  template: `
    <app-http-page
      code="403"
      title="Рухсат берилмади!"
      message="Сизда сўралган маълумотларга киришга рухсатингиз йўқ"
    ></app-http-page>
  `,
  standalone: true,
  imports: [HttpPageComponent],
})
export class Error403Component {
}

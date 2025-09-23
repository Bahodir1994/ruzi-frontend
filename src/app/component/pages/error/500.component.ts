import {Component} from '@angular/core';
import {HttpPageComponent} from '../../http-page/http-page.component';

@Component({
  selector: 'app-error-500',
  template: `
    <app-http-page
      code="500"
      title="Server went wrong!"
      message="Just kidding, looks like we have an internal issue, please try refreshing."
    >
    </app-http-page>
  `,
  standalone: true,
  imports: [HttpPageComponent],
})
export class Error500Component {
}

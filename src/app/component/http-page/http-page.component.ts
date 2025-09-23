import {Component, Input} from '@angular/core';
import {Button} from 'primeng/button';
import {Location} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-http-page',
  imports: [Button],
  templateUrl: './http-page.component.html',
  styleUrl: './http-page.component.scss'
})
export class HttpPageComponent {
  @Input() code = '';
  @Input() title = '';
  @Input() message = '';

  constructor(private location: Location) {
  }

  navigateToSite() {
    const targetUrl = 'http://172.16.112.7:9080/esad';

    if (window.location.href === targetUrl) {
      window.location.reload();
    } else {
      window.open(targetUrl, '_self');
    }
  }

  navigateBack() {
    this.location.back();
  }
}

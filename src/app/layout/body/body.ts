import {Component} from '@angular/core';
import {Panel} from 'primeng/panel';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [
    Panel,
    RouterOutlet
  ],
  templateUrl: './body.html',
  standalone: true,
  styleUrl: './body.scss'
})
export class Body {

}

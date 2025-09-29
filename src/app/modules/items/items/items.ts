import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-items',
  imports: [
    RouterOutlet
  ],
  templateUrl: './items.html',
  standalone: true,
  styleUrl: './items.scss'
})
export class Items {

}

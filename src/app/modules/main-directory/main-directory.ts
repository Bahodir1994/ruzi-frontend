import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-directory',
  imports: [
    RouterOutlet
  ],
  templateUrl: './main-directory.html',
  standalone: true,
  styleUrl: './main-directory.scss'
})
export class MainDirectory {

}

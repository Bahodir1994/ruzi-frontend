import {Component} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {MenuComponent} from '../../component/menu/menu.component';
import {NgStyle} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [
    Navbar,
    MenuComponent,
    NgStyle,
    RouterOutlet
  ],
  templateUrl: './admin.html',
  standalone: true,
  styleUrl: './admin.scss'
})
export class Admin {
  visible = true;

  toggleDrawer() {
    this.visible = !this.visible;
  }

}

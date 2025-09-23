import {Component} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {MenuComponent} from '../../component/menu/menu.component';
import {NgStyle} from '@angular/common';
import {Body} from '../body/body';

@Component({
  selector: 'app-admin',
  imports: [
    Navbar,
    MenuComponent,
    NgStyle,
    Body,
  ],
  templateUrl: './admin.html',
  standalone: true,
  styleUrl: './admin.scss'
})
export class Admin {
  visible = false;

  toggleDrawer() {
    this.visible = !this.visible;
  }

}

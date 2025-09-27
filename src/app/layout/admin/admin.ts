import {Component} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {MenuComponent} from '../../component/menu/menu.component';
import {NgStyle} from '@angular/common';
import {Body} from '../body/body';
import {RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';
import {Breadcrumb} from '../../component/breadcrumb/breadcrumb';

@Component({
  selector: 'app-admin',
  imports: [
    Navbar,
    MenuComponent,
    NgStyle,
    Body,
    RouterOutlet,
    Button,
    Breadcrumb,
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

import {Component, EventEmitter, Output} from '@angular/core';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {Breadcrumb} from '../../component/breadcrumb/breadcrumb';
import {UserprofileComponent} from '../../component/userprofile/userprofile.component';
import {ThemeSwitcher} from '../../configuration/theme/themeswitcher';

@Component({
  selector: 'app-navbar',
  imports: [
    Toolbar,
    Button,
    Breadcrumb,
    UserprofileComponent,
    ThemeSwitcher
  ],
  templateUrl: './navbar.html',
  standalone: true,
  styleUrl: './navbar.scss'
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

}

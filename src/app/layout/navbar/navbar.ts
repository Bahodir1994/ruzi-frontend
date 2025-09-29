import {Component, EventEmitter, Output} from '@angular/core';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {UserprofileComponent} from '../../component/userprofile/userprofile.component';
import {ThemeSwitcher} from '../../configuration/theme/themeswitcher';
import {BreadcrumbComponent} from '../../component/breadcrumb/breadcrumb';

@Component({
  selector: 'app-navbar',
  imports: [
    Toolbar,
    Button,
    UserprofileComponent,
    ThemeSwitcher,
    BreadcrumbComponent
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

import {Component, effect, signal} from '@angular/core';
import {AuthService} from '../../configuration/authentication/auth.service';
import {MenuItem} from 'primeng/api';
import {Button, ButtonDirective} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {Dialog} from 'primeng/dialog';
import {Ripple} from "primeng/ripple";
import {Drawer} from "primeng/drawer";
import {Chip} from "primeng/chip";
import {Avatar} from "primeng/avatar";

@Component({
  selector: 'app-userprofile',
  imports: [
    Dialog,
    Button,
    Ripple,
    Drawer,
    Chip,
    Avatar
  ],
  templateUrl: './userprofile.html',
  standalone: true,
  styleUrl: './userprofile.scss'
})
export class Userprofile {
  profileDialogVisible = signal(false);

  menuItems: MenuItem[] = [];

  constructor(public auth: AuthService) {

    effect(() => {
      if (!this.auth.isAuthenticated()) {
        this.menuItems = [];
        return;
      }
      console.log('auth', auth);
      this.menuItems = [
        {
          label: 'Profil',
          icon: 'pi pi-user',
          command: () => this.openProfile()
        },
        {
          separator: true
        },
        {
          label: 'Chiqish',
          icon: 'pi pi-sign-out',
          command: () => this.auth.logout()
        }
      ];
    });
  }

  openProfile() {
    this.profileDialogVisible.set(true);
  }
}

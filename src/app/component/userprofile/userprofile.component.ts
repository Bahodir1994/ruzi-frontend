import {Component, OnInit} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {Button} from "primeng/button";
import {ConfirmationService, MessageService} from "primeng/api";
import {TagModule} from "primeng/tag";
import {ListboxModule} from "primeng/listbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {InputIconModule} from "primeng/inputicon";
import {Menu} from 'primeng/menu';
import {Panel} from 'primeng/panel';
import {Tooltip} from 'primeng/tooltip';
import {Divider} from 'primeng/divider';
import {ScrollPanel} from 'primeng/scrollpanel';
import {UserGroups, UserRoleList} from './userprofile';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../configuration/authentication/auth.service';
import {KeycloakProfile} from 'keycloak-js';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    ToastModule,
    ConfirmPopupModule,
    Button,
    TagModule,
    ListboxModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    InputIconModule,
    Menu,
    Panel,
    NgForOf,
    Tooltip,
    Divider,
    ScrollPanel
  ],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class UserprofileComponent implements OnInit {
  user: KeycloakProfile | null = null;
  userRoles?: UserRoleList[];
  userGroups?: UserGroups[];
  selectedUserRole: UserRoleList | null = null;

  constructor(protected authService: AuthService, private translateService: TranslateService) {
  }

  async ngOnInit() {
    this.user = await this.authService.loadUserProfile();
    this.userRoles = this.authService.loadUserRoles();
    this.userGroups = this.authService.loadUserGroupsAndRoles();

    this.userGroups = this.userGroups.map(group => ({
      ...group,
      name: this.translateService.instant(group.name),
      roles: group.roles?.map(role => this.translateService.instant(role))
    }));

    if (this.userRoles && this.userRoles.length > 0) {
      this.selectedUserRole = this.userRoles[0];
    }
  }

}

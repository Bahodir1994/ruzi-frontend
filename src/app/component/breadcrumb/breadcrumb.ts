import {Component} from '@angular/core';
import {BreadcrumbService} from '../../service/braedcrumb/breadcrumb';
import {AsyncPipe} from '@angular/common';
import {MenuItem} from 'primeng/api';
import {BehaviorSubject} from 'rxjs';
import {Breadcrumb} from 'primeng/breadcrumb';


@Component({
  selector: 'app-breadcrumb',
  imports: [
    AsyncPipe,
    Breadcrumb
  ],
  templateUrl: './breadcrumb.html',
  standalone: true,
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent {
  private _breadcrumbs$ = new BehaviorSubject<MenuItem[]>([]);
  breadcrumbs$ = this._breadcrumbs$.asObservable();

  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}

import {Component} from '@angular/core';
import {BreadcrumbService} from '../../service/braedcrumb/breadcrumb';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './breadcrumb.html',
  standalone: true,
  styleUrl: './breadcrumb.scss'
})
export class Breadcrumb {
  breadcrumbs$;

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject, filter} from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.init();
  }

  private init(): void {
    const root = this.router.routerState.snapshot.root;
    const initialBreadcrumbs = this.buildBreadcrumbs(root);
    this.breadcrumbsSubject.next(initialBreadcrumbs);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs = this.buildBreadcrumbs(root);
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const path = route.routeConfig?.path;
    const label = route.data['breadcrumb'];

    const nextUrl = path ? `${url}/${path}` : url;

    if (label) {
      breadcrumbs.push({label, url: nextUrl});
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}

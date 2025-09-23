import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerContentSubject = new BehaviorSubject<TemplateRef<any> | null>(null);
  headerContent$ = this.headerContentSubject.asObservable();
  private keepHeaderRoutes: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (!this.keepHeaderRoutes.some(route => event.urlAfterRedirects.includes(route))) {
          this.clearHeaderContent();
        }
      });
  }

  setHeaderContent(template: TemplateRef<any>, keepRoutes: string[] = []) {
    this.headerContentSubject.next(template);
    this.keepHeaderRoutes = keepRoutes;
  }

  clearHeaderContent() {
    this.headerContentSubject.next(null);
  }
}

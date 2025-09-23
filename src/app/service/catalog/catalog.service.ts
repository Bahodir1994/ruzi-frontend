import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  NavigationEnd,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {BehaviorSubject, distinctUntilChanged, filter, Observable, of} from "rxjs";
import {ApiConfigService} from "../../configuration/resursurls/apiConfig.service";
import {ResponseDto} from "../../configuration/resursurls/responseDto";
import {FindResultApiUrl} from "../../configuration/resursurls/apiConfigDto";
import {HttpClient} from "@angular/common/http";
import {SpBntStatusType} from "./catalogDto";

@Injectable({
  providedIn: 'root'
})
export class CatalogService implements CanActivate {
  private spBntStatusTypeSubject: BehaviorSubject<SpBntStatusType[] | undefined> = new BehaviorSubject<SpBntStatusType[] | undefined>(undefined);

  constructor(
    private router: Router,
    private apiService: ApiConfigService,
    private http: HttpClient,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).url;
        this.loadDataForRoute(url);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const routePath = state.url;
    this.loadDataForRoute(routePath);
    return of(true);
  }

  loadDataForRoute(activatedRoute: string): void {
    if (activatedRoute.includes('/references/bnt') || activatedRoute.includes('/references/steps')) {
      this.apiService.loadConfigAndGetResultUrl('bnt', 'bnt_app_cmdt_status').subscribe(value => {
        if (value) {
          this.getBntStatus(value);
        }
      });
    }
  }

  /** load from api urls **/
  getBntStatus(data: FindResultApiUrl): void {
    this.http.get<ResponseDto>(data.host + data.url).subscribe(value => {
      if (value.success) {
        this.spBntStatusTypeSubject.next(value.data as SpBntStatusType[]);
      }
    });
  }


  /** subscribes **/
  get spBntStatusType$(): Observable<SpBntStatusType[] | undefined> {
    return this.spBntStatusTypeSubject.asObservable().pipe(distinctUntilChanged());
  }
}

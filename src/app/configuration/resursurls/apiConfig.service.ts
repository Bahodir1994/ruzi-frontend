import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApiUrls, FindResultApiUrl} from "./apiConfigDto";
import {apiConfigData} from "./apiConfigData";

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private apiConfigSubject = new BehaviorSubject<ApiUrls[]>([]);
  private findResultUrl = new BehaviorSubject<FindResultApiUrl | null>(null);
  private userRoles: string[] = [];

  apiConfigSubject$ = this.apiConfigSubject.asObservable();

  constructor() {
    this.apiConfigSubject.next(apiConfigData);
  }

  setUserRoles(roles: string[]) {
    this.userRoles = roles;
  }

  loadConfigAndGetResultUrl(moduleName: string, label: string): Observable<FindResultApiUrl | null> {
    return this.apiConfigSubject$.pipe(
      map(config => {
        const moduleResult = config.find(mod => mod.module === moduleName && mod.active);
        if (moduleResult) {
          const selectedUrls = moduleResult.list.filter(subModule =>
            subModule.label === label &&
            subModule.active &&
            (
              !subModule.roles ||
              subModule.roles.length === 0 ||
              subModule.roles.some(role => this.userRoles.includes(role)) // Или у пользователя есть нужная роль
            )
          );
          if (selectedUrls.length > 0) {
            const fullMatch = selectedUrls.find(sub =>
              sub.roles?.some(role =>
                role.endsWith('_FULL') && this.userRoles.includes(role)
              )
            );
            const selectedUrl = fullMatch ?? selectedUrls[0];
            const result: FindResultApiUrl = {
              host: moduleResult.host,
              ssl: moduleResult.ssl,
              url: selectedUrl.url,
              method: selectedUrl.method,
              label: selectedUrl.label,
              comment: selectedUrl.comment,
            };
            this.findResultUrl.next(result);
            return result;
          }
        }
        return null;
      })
    );
  }

}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {Toast} from 'primeng/toast';
import {PrimengLocaleService} from './service/translate/primeng-locale.service';
import {ApiConfigService} from './configuration/resursurls/apiConfig.service';
import {AuthService} from './configuration/authentication/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from './service/translate/language.service';
import {Title} from '@angular/platform-browser';
import {filter, map} from 'rxjs';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isMobile = false;
  isTablet = false;
  isDesktop = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private primeng: PrimeNG,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private translate: TranslateService,
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
    private primengLocale: PrimengLocaleService
  ) {
    this.initUserRoles();
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
    console.log({
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop
    });

    this.languageService.initLanguage();
    this.authService.startTokenRefresh();
    this.primengLocale.setLocale(this.languageService.getCurrentLanguage())

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'];
      })).subscribe((title: string) => {
      if (title) {
        this.titleService.setTitle(title);
      }
    });

    this.translate.onLangChange.subscribe(langEvent => {
      this.primengLocale.setLocale(langEvent.lang)
    });
    this.primeng.ripple.set(true);
  }

  private initUserRoles() {
    const roles = this.authService.loadUserRoles().map(role => role.code);
    this.apiConfigService.setUserRoles(roles);
  }

}

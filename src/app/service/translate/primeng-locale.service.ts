import {Injectable} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {uz} from './locale/uz';
import {oz} from './locale/oz';
import {en} from './locale/en';
import {ru} from './locale/ru';

@Injectable({
  providedIn: 'root'
})
export class PrimengLocaleService {
  constructor(private primengConfig: PrimeNG) {
  }

  setLocale(lang: string) {
    const locales: any = {ru, uz, oz, en};
    this.primengConfig.setTranslation(locales[lang] || oz);
  }
}

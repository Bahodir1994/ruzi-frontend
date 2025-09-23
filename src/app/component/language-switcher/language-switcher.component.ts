import {Component} from '@angular/core';
import {LanguageService} from '../../service/translate/language.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {LangTypes} from './lang-switch-dto';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    ButtonModule,
    Tooltip
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  selectedLang: LangTypes = {name: '', code: '', icon: ''};
  languages: LangTypes[] = [];
  menuItems: any[] = [];

  constructor(public languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.languages = [
      {name: 'Узб', code: 'uz', icon: 'uz'},
      {name: 'O‘zb', code: 'oz', icon: 'uz'},
      {name: 'Рус', code: 'ru', icon: 'ru'},
      {name: 'Eng', code: 'en', icon: 'gb'}
    ];

    const langCode = this.languageService.getCurrentLanguage();
    this.selectedLang = this.languages.find(l => l.code === langCode) ?? this.languages[0];

    this.menuItems = this.languages.map(lang => ({
      label: lang.name,
      icon: `fi fi-${lang.icon}`,
      command: () => this.changeLang(lang),
      disabled: ['oz', 'ru', 'en'].includes(lang.code)
    }));
  }

  changeLang(lang: LangTypes) {
    this.selectedLang = lang;
    this.languageService.switchLanguage(lang.code);
  }
}

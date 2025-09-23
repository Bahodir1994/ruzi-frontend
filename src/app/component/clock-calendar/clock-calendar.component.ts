// import {Component, OnInit, ViewChild} from '@angular/core';
// // import {CalendarOptions} from '@fullcalendar/core';
// // import dayGridPlugin from '@fullcalendar/daygrid';
// // import interactionPlugin from '@fullcalendar/interaction';
// // import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
// import {Drawer} from 'primeng/drawer';
// // import ruLocale from '@fullcalendar/core/locales/ru';
// // import uzLocale from '@fullcalendar/core/locales/uz-cy';
// // import ozLocale from '@fullcalendar/core/locales/uz';
// // import enLocale from '@fullcalendar/core/locales/en-gb';
// import {LanguageService} from '../../service/translate/language.service';
// import {TranslateService} from '@ngx-translate/core';
// import uzCyrlLocale from './uz-cyrillic-locale';
//
// @Component({
//   selector: 'app-clock-calendar',
//   standalone: true,
//   imports: [
//     FullCalendarModule,
//     Drawer
//   ],
//   templateUrl: './clock-calendar.component.html',
//   styleUrls: ['./clock-calendar.component.scss'],
// })
// export class ClockCalendarComponent implements OnInit {
//   @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
//
//   currentDate: string = '';
//   currentTime: string = '';
//   showCalendar = false;
//   userId = 'user123'; // можно заменить на динамический ID
//   calendarOptions!: CalendarOptions;
//
//   constructor(
//     private languageService: LanguageService,
//     private translate: TranslateService
//   ) {
//   }
//
//   ngOnInit(): void {
//     const currentLang = this.languageService.getCurrentLanguage();
//
//     this.updateTime();
//     setInterval(() => this.updateTime(), 1000);
//
//     const savedEvents = localStorage.getItem(`events_${this.userId}`);
//     const events = savedEvents ? JSON.parse(savedEvents) : [];
//
//
//     this.calendarOptions = {
//       plugins: [dayGridPlugin, interactionPlugin],
//       initialView: 'dayGridMonth',
//       locale: this.getCalendarLocale(currentLang),
//       height: '100%',
//       contentHeight: 'auto',
//       editable: true,
//       selectable: true,
//       events,
//       dateClick: this.handleDateClick.bind(this),
//       eventAdd: this.saveEvents.bind(this),
//       eventChange: this.saveEvents.bind(this),
//       eventRemove: this.saveEvents.bind(this),
//     };
//
//     this.translate.onLangChange.subscribe(langEvent => {
//       const newLocale = this.getCalendarLocale(langEvent.lang);
//       this.calendarOptions = {
//         ...this.calendarOptions,
//         locale: newLocale
//       };
//
//       setTimeout(() => {
//         this.fullCalendar.getApi().setOption('locale', newLocale.code);
//       });
//     });
//   }
//
//   getCalendarLocale(lang: string) {
//     switch (lang) {
//       case 'ru':
//         return ruLocale;
//       case 'uz':
//         return uzCyrlLocale;
//       case 'oz':
//         return ozLocale;
//       case 'en':
//         return enLocale;
//       default:
//         return uzLocale;
//     }
//   }
//
//   updateTime() {
//     const localesMap: Record<string, string> = {
//       ru: 'ru-RU',
//       uz: 'uz-Cyrl-UZ', // Узбекский кириллица
//       oz: 'uz-Latn-UZ', // Узбекский латиница
//       en: 'en-GB'
//     };
//
//     const lang = this.languageService.getCurrentLanguage();
//     const locale = localesMap[lang] || 'ru-RU'; // fallback по умолчанию
//
//     const date = new Date();
//
//     const formatterDate = new Intl.DateTimeFormat(locale, {
//       timeZone: 'Asia/Tashkent',
//       year: 'numeric',
//       month: 'long',
//       day: '2-digit',
//     });
//
//     const formatterTime = new Intl.DateTimeFormat(locale, {
//       timeZone: 'Asia/Tashkent',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//     });
//
//     this.currentDate = formatterDate.format(date);
//     this.currentTime = formatterTime.format(date);
//
//   }
//
//   toggleCalendar() {
//     this.showCalendar = !this.showCalendar;
//
//     if (this.showCalendar) {
//       setTimeout(() => {
//         this.fullCalendar.getApi().updateSize();
//       }, 200);
//     }
//   }
//
//   handleDateClick(arg: any) {
//     const title = prompt('Хабар қўшинг}:');
//     if (title) {
//       const newEvent = {title, date: arg.dateStr};
//       const events = [...(this.calendarOptions.events as any[]), newEvent];
//       this.calendarOptions.events = events;
//       this.saveEvents();
//     }
//   }
//
//   saveEvents() {
//     localStorage.setItem(
//       `events_${this.userId}`,
//       JSON.stringify(this.calendarOptions.events)
//     );
//   }
// }

import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Menu} from "./sidebarDto";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(true);
  sidebarState$ = this.isSidebarOpen.asObservable();

  /************************ Creating start ***************************************/
  private menuItems = new BehaviorSubject<Menu[]>([]);
  menuItems$ = this.menuItems.asObservable();
  http: HttpClient;

  /******************************start*********************************/

  constructor(http: HttpClient) {
    this.http = http;
    this.loadMenuItems();
  }

  /********************** Functions **************************************/

  /* close or open sidebar */
  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  /* for load sidebar menu from json */
  private loadMenuItems() {
    this.http.get<Menu[]>('/assets/data/other/menu.json')
      .subscribe({
        next: data => this.menuItems.next(data),
        error: error => console.error('Could not load menu items', error)
      });
  }
}

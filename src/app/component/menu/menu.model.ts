import {MenuItem} from 'primeng/api';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Predmetlar',
    icon: 'pi pi-tags',
    items: [
      {
        label: "Tovarlar to'plami",
        icon: 'pi pi-stop',
        routerLink: ['/items/item']
      },
      {
        label: 'Kategoriyalar',
        icon: 'pi pi-stop',
        routerLink: ['/items/category']
      },
      {
        label: "O'lchov birligi",
        icon: 'pi pi-stop',
        routerLink: ['/items/unit']
      }
    ]
  },
  {
    label: 'Sozlamalar',
    icon: 'pi pi-cog',
    items: [
      {
        label: "Personal ma'lumotlar",
        icon: 'pi pi-stop',
        routerLink: ['/settings/personal-info']
      },
      {
        label: "Biznes ma'lumotlari",
        icon: 'pi pi-stop',
        items: [
          {
            label: 'Kirim',
            icon: 'pi pi-stop',
            routerLink: ['/settings/business-info/purchase-order']
          },
          {
            label: 'Joylashuv',
            icon: 'pi pi-stop',
            routerLink: ['/settings/business-info/warehouse']
          }
        ]
      }
    ]
  },
  {
    label: 'Kassa',
    icon: 'pi pi-calculator',
    routerLink: ['/cashbox']
  },
  {
    label: 'Analtika',
    icon: 'pi pi-calculator',
    routerLink: ['/analytics']
  }
];

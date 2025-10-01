export interface MenuAs {
  route: string,
  label: string,
  icon?: string,
  type: string,
  items?: MenuChildren[],
  permissions: MenuPermission[],
}

export interface MenuChildren {
  route: string,
  label: string,
  type: string,
  icon?: string,
  items?: MenuChildren[],
  permissions: MenuPermission[]
}

export interface MenuPermission {
  name: string,
}

export interface MenuForNavigation {
  name: string,
  url: string,
  icon?: string
}

export interface MenuForNavigationHome {
  label: string,
  routerLink: string,
  icon?: string
}


export interface UserRoleList {
  name: string;
  code: string;
}

export interface UserGroups {
  name: string;
  code: string;
  roles: string[];
}

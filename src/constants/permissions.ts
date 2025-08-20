import { IUserRole, USER_ROLES } from "../interfaces/common/roles.interface";

export type PermissionGroup =
  | "users"
  | "budgets"
  | "categories"
  | "accounts"
  | "transactions";
export type PermissionAction = "create" | "read" | "update" | "delete";

export type PermissionKey = `${PermissionGroup}.${PermissionAction}`;

export const PERMISSIONS: Record<
  PermissionGroup,
  Partial<Record<PermissionAction, IUserRole[]>>
> = {
  users: {
    create: [USER_ROLES.ADMIN],
    read: [USER_ROLES.ADMIN, USER_ROLES.USER],
    update: [USER_ROLES.ADMIN, USER_ROLES.USER], // ⚠️ permitimos a USER, pero validamos en lógica de negocio
    delete: [USER_ROLES.ADMIN],
  },
  budgets: {
    create: [USER_ROLES.ADMIN, USER_ROLES.USER],
    read: [USER_ROLES.ADMIN, USER_ROLES.USER],
    update: [USER_ROLES.ADMIN, USER_ROLES.USER],
    delete: [USER_ROLES.ADMIN],
  },
  categories: {
    create: [USER_ROLES.ADMIN, USER_ROLES.USER],
    read: [USER_ROLES.ADMIN, USER_ROLES.USER],
    update: [USER_ROLES.ADMIN, USER_ROLES.USER],
    delete: [USER_ROLES.ADMIN],
  },
  accounts: {
    create: [USER_ROLES.ADMIN, USER_ROLES.USER],
    read: [USER_ROLES.ADMIN, USER_ROLES.USER],
    update: [USER_ROLES.ADMIN, USER_ROLES.USER],
    delete: [USER_ROLES.ADMIN],
  },
  transactions: {
    create: [USER_ROLES.ADMIN, USER_ROLES.USER],
    read: [USER_ROLES.ADMIN, USER_ROLES.USER],
    update: [USER_ROLES.ADMIN, USER_ROLES.USER],
    delete: [USER_ROLES.ADMIN],
  },
};

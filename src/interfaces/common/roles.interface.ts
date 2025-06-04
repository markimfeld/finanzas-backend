export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    VIEWER: 'viewer',
} as const;

export type IUserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
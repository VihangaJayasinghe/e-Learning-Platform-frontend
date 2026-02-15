export const ClassStatus = {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ARCHIVED: 'ARCHIVED'
} as const;

export type ClassStatus = typeof ClassStatus[keyof typeof ClassStatus];

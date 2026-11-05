export const FREE_LIMITS = { resources: 40, collections: 8 } as const

export type LimitKind = keyof typeof FREE_LIMITS
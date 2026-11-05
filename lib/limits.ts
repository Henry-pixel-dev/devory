export const FREE_LIMITS = { resources: 21, collections: 6 } as const

export type LimitKind = keyof typeof FREE_LIMITS
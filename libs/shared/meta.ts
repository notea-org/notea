export enum NOTE_DELETED {
  NORMAL,
  DELETED,
}

export enum NOTE_SHARED {
  PRIVATE,
  PUBLIC,
}

export enum NOTE_PINNED {
  UNPINNED,
  PINNED,
}

export const PAGE_META_KEY = <const>[
  'title',
  'pid',
  'id',
  'shared',
  'pic',
  'date',
  'deleted',
  'pinned',
]

export type metaKey = typeof PAGE_META_KEY[number]

export const NUMBER_KEYS: metaKey[] = ['deleted', 'shared', 'pinned']

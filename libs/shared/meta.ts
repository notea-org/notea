export enum NOTE_DELETED {
  NORMAL,
  DELETED,
}

export enum NOTE_SHARED {
  PRIVATE,
  PUBLIC,
}

type PAGE_META_KEY =
  | 'title'
  | 'pid'
  | 'id'
  | 'shared'
  | 'pic'
  | 'date'
  | 'deleted'

export const PAGE_META_KEY: PAGE_META_KEY[] = [
  'title',
  'pid',
  'id',
  'shared',
  'pic',
  'date',
  'deleted',
]

export const NUMBER_KEYS: PAGE_META_KEY[] = ['deleted', 'shared']

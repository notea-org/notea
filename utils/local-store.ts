import localforage from 'localforage'

export const uiStore = localforage.createInstance({
  name: 'notea-ui',
})

export const pageStore = localforage.createInstance({
  name: 'notea-pages',
})

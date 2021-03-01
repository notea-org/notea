import localforage from 'localforage'

export const uiStore = localforage.createInstance({
  name: 'notea-ui',
})

export const noteStore = localforage.createInstance({
  name: 'notea-notes',
})

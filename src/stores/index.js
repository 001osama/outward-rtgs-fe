// stores/useAppStore.js
import { defineStore } from 'pinia'

const useHeaderStore = defineStore('header', {
  state: () => ({
    headerTitle: '',
  }),
  actions: {
    setHeaderTitle(title) {
      this.headerTitle = title
    },
  },
  persist: false,
})

export { useHeaderStore }

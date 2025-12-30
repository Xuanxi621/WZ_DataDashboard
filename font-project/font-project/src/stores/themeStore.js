import { defineStore } from 'pinia'

export const useThemeStore = defineStore('themeStore', {
    state: () => {
        return {
            theme: 'chalk'
        }
    },

    actions: {
        changeTheme() {
            if (this.theme === 'chalk') {
                this.theme = 'vintage'
            } else {
                this.theme = 'chalk'
            }
        }
    }
})
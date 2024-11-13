export const themeStore = defineStore('theme', {
  state: () => ({
    theme: {
      asideMenuFolded: true,
      rail: false
    }
  }),
  getters: {
    getTheme: (state) => state.theme,
    getAsideMenuFolded: (state) => state.theme.asideMenuFolded,
    getRail: (state) => state.theme.rail
  },
  actions: {
    toggleAsideMenuFolded() {
      // this.theme.asideMenuFolded = !this.theme.asideMenuFolded;
      this.theme.rail = !this.theme.rail;
    },
    toggleRail() {
      this.theme.rail = false;
    }
  }
});

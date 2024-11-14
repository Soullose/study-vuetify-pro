import { defineStore } from 'pinia';

export const w2RouterStore = defineStore('w2Router', {
  state: () => {
    return {
      router: []
    };
  },
  getters: {
    getRouter: (router) => {
      return router;
    }
  },
  actions: {
    setRouter(router: any) {
      this.router = router;
    }
  }
});

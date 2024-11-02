/// 菜单
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [
      {
        title: '首页',
        icon: 'mdi-home',
        to: '/'
      },
      {
        title: '关于',
        icon: 'mdi-information',
        to: '/about'
      }
    ]
  }),
  /// 获取
  getters: {
    /// 获取菜单
    getMenus: (state) => state.menus
  },
  /// 事件
  actions: {
    setMenus(menus: any) {
      this.menus = menus;
    }
  }
});

import { asyncRouterHandle } from "@/utils/asyncRouter";

import { asyncMenu } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";

// 动态路由数组
const routerListArr = [];
// 应该是需要缓存的路由数组
const keepAliveRoutersArr = [];
/**
 *  筛选路由数组
 *  routes：全部路由数据 routeMap：键为name值为路由对象的数组
 */
const formatRouter = (routes, routeMap) => {
  routes &&
    routes.forEach((item) => {
      if (
        (!item.children || item.children.every((ch) => ch.hidden)) &&
        item.name !== "404" &&
        !item.hidden
      ) {
        routerListArr.push({ label: item.meta.title, value: item.name });
      }
      item.meta.btns = item.btns;
      item.meta.hidden = item.hidden;
      routeMap[item.name] = item;
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap);
      }
    });
};
/**
 * 筛选缓存路由
 * @param {*} routes
 */
const KeepAliveFilter = (routes) => {
  routes &&
    routes.forEach((item) => {
      // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
      if (
        (item.children && item.children.some((ch) => ch.meta.keepAlive)) ||
        item.meta.keepAlive
      ) {
        item.component &&
          item.component().then((val) => {
            keepAliveRoutersArr.push(val.default.name);
          });
      }
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children);
      }
    });
};

export const useRouterStore = defineStore("router", () => {
  const asyncRouters = ref([]);
  const routerList = ref(routerListArr);
  const keepAliveRouters = ref(keepAliveRoutersArr);
  const routeMap = {};
  // 从后台获取动态路由
  const SetAsyncRouter = async () => {
    const baseRouter = [
      {
        path: "/layout",
        name: "layout",
        component: "view/layout/index.vue",
        meta: {
          title: "底层layout",
        },
        children: [],
      },
    ];
    // 后端返回动态路由
    const asyncRouterRes = await asyncMenu();
    console.log(asyncRouterRes);
    // 动态路由数据
    const asyncRouter = asyncRouterRes.data.menus;
    // 加入错误页面路由
    asyncRouter &&
      asyncRouter.push(
        {
          path: "404",
          name: "404",
          hidden: true,
          meta: {
            title: "迷路了*。*",
            closeTab: true,
          },
          component: "view/error/index.vue",
        },
        {
          path: "reload",
          name: "Reload",
          hidden: true,
          meta: {
            title: "",
            closeTab: true,
          },
          component: "view/error/reload.vue",
        }
      );
    // 筛选路由
    formatRouter(asyncRouter, routeMap);
    // 动态路由都是 layout 的子路由
    baseRouter[0].children = asyncRouter;
    // 应该还是个错误路由
    baseRouter.push({
      path: "/:catchAll(.*)",
      redirect: "/layout/404",
    });
    // console.log(baseRouter);
    // 获取路由路径对应的路由懒加载
    asyncRouterHandle(baseRouter);
    KeepAliveFilter(asyncRouter);
    asyncRouters.value = baseRouter;
    routerList.value = routerListArr;
    keepAliveRouters.value = keepAliveRoutersArr;
    return true;
  };

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    SetAsyncRouter,
    routeMap,
  };
});

// ../view/about/index.vue: () => import("/src/view/about/index.vue")组成的对象
const viewModules = import.meta.glob("../view/**/*.vue");
//../plugin/email/view/index.vue: () => import("/src/plugin/email/view/index.vue")组成的对象
const pluginModules = import.meta.glob("../plugin/**/*.vue");

export const asyncRouterHandle = (asyncRouter) => {
  // console.log(viewModules);
  // console.log(pluginModules);
  // console.log(asyncRouter[0].component);
  asyncRouter.forEach((item) => {
    if (item.component) {
      // item.component: view/layout/index.vue类似的路径
      if (item.component.split("/")[0] === "view") {
        item.component = dynamicImport(viewModules, item.component);
        // console.log(item.component);
      } else if (item.component.split("/")[0] === "plugin") {
        item.component = dynamicImport(pluginModules, item.component);
      }
    } else {
      delete item["component"];
    }
    if (item.children) {
      asyncRouterHandle(item.children);
    }
  });
};
/**
 * 获取路径对应的路由懒加载
 * @returns () => import("/src/view/error/reload.vue")
 */
function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace("../", "");
    return k === component;
  });
  const matchKey = matchKeys[0];
  return dynamicViewsModules[matchKey];
}

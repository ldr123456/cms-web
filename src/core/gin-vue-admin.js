/*
 * gin-vue-admin web框架组
 *
 * */
// 加载网站配置文件夹
import { register } from './global'

export default {
  install: (app) => {
    register(app)
    console.log(`
       欢迎使用 Gin-Vue-Admin
       当前版本:v2.5.3b
       GVA讨论社区:https://support.qq.com/products/371961
       默认前端文件运行地址:http://127.0.0.1:${import.meta.env.VITE_CLI_PORT}
    `)
  }
}

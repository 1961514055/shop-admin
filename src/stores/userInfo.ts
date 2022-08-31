import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import { ElMessage } from 'element-plus'
import { staticRoutes, allAsyncRoutes, anyRoute } from '@/router/routes'
import userInfoApi from '@/api/userInfo';
import type { infoModel } from '@/api/userInfo'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import { cloneDeep } from 'lodash';
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */


/**
 * 用户返回数据 和 动态路由进行筛选
 * 参数一: 动态路由 - 在routes.ts中定义的
 * 参数二: 后端返回的 routesName 数据, 这个数组中放的都是 我们定义路由时的name属性
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], routesName: string[]) => {
  const result = routes.filter(route => {
    if (route.children) { //如果有子路由
      route.children = filterAsyncRoutes(route.children, routesName)
    }
    return routesName.includes(route.name as string)
  })
  return result
}

// 动态添加路由
const addAsyncRoutes = (allRoutes: RouteRecordRaw[]) => {
  allRoutes.forEach(route => {
    router.addRoute(route)  //动态添加
  })
}

// this.menuRoutes = staticRoutes;

// 菜单的展示 和 动态路由的添加(有点晕) 都在这里处理
// 1. 菜单展示
//    拿用户返回的信息中的 userinfo.routes 这个数组
//    和 定义的动态路由去匹配
//    注意: 现在我们路由分为三部分: 静态路由、动态路由、任意路由
//  this.userinfo.routes  ---> 后端返回的数据,也可以通过 result.routes拿
//  allAsyncRoutes ---> 需要引入,在routes.ts中定义的
// 定义state里面数据类型
// 2. 动态路由的添加
//    只能注册当前用户可以访问的路由,其他没有权限的路由不能注册
//    这么做是为了防止用户输入url直接访问这个页面
//    这里需要动态添加路由

export interface UserInfoState {
  token: string,
  userInfo: infoModel,
  menuRoutes: RouteRecordRaw[],
}

// 用来初始化用户信息
const resultUserInfo = () => ({
  avatar: '',// 图片
  buttons: [],
  name: '',
  roles: [],
  routes: [],
})


export const useUserInfoStore = defineStore('userInfo', {

  state: (): UserInfoState => ({
    token: getToken() as string,
    // token: '',
    userInfo: resultUserInfo(),
    menuRoutes: [] // 该数据用于渲染侧边栏
  }),

  actions: {
    // 登录
    async login(username: string, password: string) {
      try {
        let result = await userInfoApi.login({ username, password })
        // console.log('登录成功',result);
        // 成功之后存token
        this.token = result.token // 存到仓库

        setToken(result.token) // 存到localstorage

      } catch (error) {
        ElMessage.error('用户名或密码错误')
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getInfo() {
      try {
        let result = await userInfoApi.info()
        // 将信息存到store中
        this.userInfo = result
        // this.menuRoutes = staticRoutes //当前数据为假数据是路由
        // 菜单显示
        const allRoutes = staticRoutes.concat(filterAsyncRoutes(cloneDeep(allAsyncRoutes), this.userInfo.routes))
        this.menuRoutes = allRoutes
        // 动态路由注册
        addAsyncRoutes(allRoutes.concat(anyRoute))
      } catch (error) {
        ElMessage.error('获取用户信息失败')
        return Promise.reject(error)
      }
    },

    async reset() {
      try {
        const result = await userInfoApi.loginOut(this.token)
        //清除toKen
        this.token = ''
        // 重置用户信息
        this.userInfo = resultUserInfo()
        setToken
      } catch (error) {
        ElMessage.error('退出登录错误')
        return Promise.reject(error)
      }

    }












    /*     getInfo () {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              this.name = 'admin'
              this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
              this.menuRoutes = staticRoutes
              resolve({name: this.name, avatar: this.avatar, token: this.token})
            }, 1000)
          })
        }, */

    // reset () {
    //   // 删除local中保存的token
    //   // removeToken()
    //   // // 提交重置用户信息的mutation
    //   // this.token = ''
    //   // this.name = ''
    //   // this.avatar = ''
    // },
  },
});

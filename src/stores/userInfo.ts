import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import { ElMessage } from 'element-plus'
import { staticRoutes } from '@/router/routes'
import userInfoApi from '@/api/userInfo';
import type { infoModel } from '@/api/userInfo'
import type { RouteRecordRaw } from 'vue-router'
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

// 定义state里面数据类型
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
        this.menuRoutes = staticRoutes //当前数据为假数据是路由
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

import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）-放不需要筛选的路由,所有人都能看到的路由
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'ele-HomeFilled',
      }
    }]
  },


];


/**
 * 定义动态路由 这个数组中放的路由是需要和用户信息中的权限进行筛选的
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Product',
    path: '/product',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        name: 'Trademark',
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',

        }
      },
      {
        name: 'Attr',
        path: 'attr/list',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '平台属性管理',

        }
      },
      {
        name: 'Spu',
        path: 'spu/list',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'Spu管理',

        }
      },
      {
        name: 'Sku',
        path: 'sku/list',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'Sku管理',

        }
      },
    ],
    meta: {
      title: '商品管理',
      icon: 'ele-GoodsFilled',

    }
  },
];
/**
 * 任意路由
 */
export const anyRoute =
/* 匹配任意的路由 必须最后注册 */
{
  path: '/:pathMatch(.*)',
  name: 'Any',
  redirect: '/404',
  meta: {
    hidden: true
  }
}

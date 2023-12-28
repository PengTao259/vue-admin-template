import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'
import { asyncRoputes } from '@/router'

/**
 * 前置守卫
 */
const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 判断是否获取过用户信息
      if (!store.getters.userId) {
        const { roles: { menus }} = await store.dispatch('user/getInfo')
        // 筛选出动态路由并添加到路由表
        const filterRoutes = asyncRoputes.filter(item => {
          return menus.includes(item.name)
        })
        store.commit('user/setRotes', filterRoutes)
        // 添加路由信息到路由表
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 添加后需要重新跳转一次 否则会报错
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

/**
 * 后置守卫
 */
router.afterEach(() => {
  NProgress.done()
})

export default router

import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'

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
        await store.dispatch('user/getInfo')
      }
      next()
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

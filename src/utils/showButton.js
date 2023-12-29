import Vue from 'vue'
import store from '@/store'

Vue.directive('permission', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding) {
    const point = store.state.user.userInfo?.roles?.points || []
    console.log(point, 'point')
    if (!point.includes(binding.value)) {
      el.remove()
      // el.disabled = true
    }
  }
})

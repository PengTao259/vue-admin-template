import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken() // 从缓存中读取初始值
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token) // 同步写入缓存
  },
  removeToken(state) {
    state.token = null
    removeToken() // 同步删除缓存
  }
}

const actions = {
  login(context, data) {
    context.commit('setToken', 'token123456')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

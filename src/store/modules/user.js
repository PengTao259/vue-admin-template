import { getToken, setToken, removeToken } from '@/utils/auth'
import { userLogin, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token) // 同步写入缓存
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeToken(state) {
    state.token = null
    removeToken() // 同步删除缓存
  }
}

const actions = {
  async login({ commit }, loginForm) {
    const data = await userLogin(loginForm)
    commit('setToken', data)
  },
  // 获取用户信息
  async getInfo({ commit }) {
    await getUserInfo().then(res => {
      commit('setUserInfo', res)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

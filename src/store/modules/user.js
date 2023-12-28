import { getToken, setToken, removeToken } from '@/utils/auth'
import { userLogin, getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {},
  rotes: constantRoutes // 静态路由表
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
  },
  setRotes(state, rotes) {
    state.rotes = constantRoutes.concat(rotes)
  }
}

const actions = {
  async login({ commit }, loginForm) {
    const data = await userLogin(loginForm)
    commit('setToken', data)
  },
  // 获取用户信息
  async getInfo({ commit }) {
    return await getUserInfo().then(res => {
      commit('setUserInfo', res)
      return res
    })
  },
  // 退出登录
  logout({ commit }) {
    commit('removeToken')
    // 清除用户信息
    commit('setUserInfo', {})
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

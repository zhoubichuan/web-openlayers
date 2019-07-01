export default {
  state: {
    username:'zfpx'
  },
  mutations: {
    set_username(state,username){
      state.username=username
    }
  },
  actions: {
    set_username({commit},username){
      commit('set_username',username)
    }
  }
}

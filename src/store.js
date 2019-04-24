import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fname: '',
    lname: '',
    fullname: '',
    email: '',
    password: '',
    active: 0,
    logged_in: false
  },

  getters: {
    getFname: state => state.fname,
    getLname: state => state.lname,
    getFullname: state => `${state.fname} ${state.lname}`,
    getEmail: state => state.email,
    getPassword: state => state.password,
    getLoggedIn: state => state.logged_in,
    getActive: state => state.active,
  },

  mutations: {
    MsetFName: (state, name) => state.fname = name,
    MsetLName: (state, name) => state.lname = name,
    MsetEmail: (state, email) => state.email = email,
    MsetPassword: (state, password) => state.password = password,
    MsetLoggedIn: (state, status) => state.logged_in = status,
    MsetActive: (state, status) => state.active = status,
  },
  actions: {
    AsetFName({ commit }, fname) {
      commit('MsetFName', fname);
    },
    AsetLName({ commit }, lname) {
      commit('MsetLName', lname);
    },
    AsetEmail({ commit }, email) {
      commit('MsetEmail', email);
    },
    AsetPassword({ commit }, password) {
      commit('MsetPassword', password);
    },
    AsetLoggedIn({ commit }, status) {
      commit('MsetLoggedIn', status);
    },
    AsetActive({ commit }, status) {
      commit('MsetActive', status);
    },
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})

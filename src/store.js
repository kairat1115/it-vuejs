import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios';
import config from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: 0,
    fname: '',
    lname: '',
    fullname: '',
    email: '',
    password: '',
    active: 0,
    logged_in: false,
    todos: []
  },

  getters: {
    getAllTodos: state => state.todos,
    getID: state => state.id,
    getFname: state => state.fname,
    getLname: state => state.lname,
    getFullname: state => `${state.fname} ${state.lname}`,
    getEmail: state => state.email,
    getPassword: state => state.password,
    getLoggedIn: state => state.logged_in,
    getActive: state => state.active,
  },

  mutations: {
    MsetID: (state, name) => state.id = name,
    MsetFName: (state, name) => state.fname = name,
    MsetLName: (state, name) => state.lname = name,
    MsetEmail: (state, email) => state.email = email,
    MsetPassword: (state, password) => state.password = password,
    MsetLoggedIn: (state, status) => state.logged_in = status,
    MsetActive: (state, status) => state.active = status,
    MsetTodos: (state, todos) => {
      for(let i = 0; i < todos.length; i++) {
        todos[i].completed = todos[i].completed !== "0";
      }
      state.todos = todos
    },
    MnewTodo: (state, todo) => {
      todo.completed = todo.completed !== "0";
      state.todos.unshift(todo)
    },
    MremoveTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id !== id),
    MupdateTodo: (state, updTodo) => {
      updTodo.completed = updTodo.completed !== "0";
      const index = state.todos.findIndex(todo => todo.id === updTodo.id);
      if (index !== -1) {
        state.todos.splice(index, 1, updTodo);
      }
    }
  },
  actions: {
    AsetID({ commit }, id) {
      commit('MsetID', id);
    },
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
    async AfetchTodos({ commit }) {
      const response = await axios.get(
          `${config.uri}/todo/get.php?user_id=${this.state.id}`
      );
      commit('MsetTodos', response.data.output.message);
    },
    async AaddTodo({ commit }, title) {
      const response = await axios.post(
          `${config.uri}/todo/create.php`,
          { user_id: this.state.id, title }
      );
      if (response.data.error !== '')
        return response.data.error;
      commit('MnewTodo', response.data.output.message);
      return 'Ok';
    },
    async AdeleteTodo({ commit }, id) {
      await axios.delete(
          `${config.uri}/todo/delete.php?user_id=${this.state.id}&id=${id}`,
      );
      commit('MremoveTodo', id);
    },
    async AfilterTodos({ commit }, e) {
      const limit = ~~e.target.options[e.target.options.selectedIndex].innerText;
      const response = await axios.get(
          `${config.uri}/todo/get.php?user_id=${this.state.id}&limit=${limit}`
      );
      commit('MsetTodos', response.data.output.message);
    },
    async AupdateTodo({ commit }, updTodo) {
      const response = await axios.put(
          `${config.uri}/todo/update.php?user_id=${this.state.id}&id=${updTodo.id}`,
          updTodo
      );
      if (response.data.error !== '')
        return response.data.error;
      commit('MupdateTodo', response.data.output.message);
      return 'Ok';
    }
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})

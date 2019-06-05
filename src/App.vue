<template>
  <div id="app">
    <div v-if="getLoggedIn">
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand :to="'/'">TODO Manager</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav id="nav">
            <b-nav-item :to="'/'">Home</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-form @submit="searchTodos">
              <b-form-input size="sm" class="mr-sm-2" v-model="searchString" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown right>
              <template slot="button-content"><em>{{getFullname}}</em></template>
              <b-dropdown-item :to="'/profile'">Profile</b-dropdown-item>
              <b-dropdown-item href="#" @click="signOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
        <div v-if="getActive === 0">
            <b-alert variant="danger" show>Account is deactivated.</b-alert>
        </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from '@/config'
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  export default {
    name: "app",
    data() {
      return {
        searchString: ''
      }
    },
    computed: {
      ...mapGetters(["getEmail", "getPassword", "getLoggedIn", "getFullname", "getActive"])
    },
    created() {
      this.checklogin()
    },
    methods: {
      ...mapMutations(["MsearchFilterTodos"]),
      ...mapActions(["AsetFName", "AsetLName", "AsetEmail", "AsetPassword", "AsetLoggedIn", "AsetActive", "AsetID", "AfetchTodos"]),
      searchTodos(e) {
        e.preventDefault();
        if (this.searchString === '') {
          this.AfetchTodos();
        } else {
          this.MsearchFilterTodos(this.searchString);
        }
      },
      checklogin() {
        let email = this.getEmail || this.$cookies.get('email') || '';
        let password = this.getPassword || this.$cookies.get('password') || '';
        if (this.getLoggedIn) {
          return
        }
        axios.post(`${config.uri}/user/check.php`, {
            email,
            password
        })
        .then(response => {
          if (response.data.output.message === "Not found") {
            this.resetLoginData();
            this.$cookies.remove('email');
            this.$cookies.remove('password');
            this.$router.push('/login')
          } else {
            let obj = response.data.output.message;
            this.AsetEmail(this.email);
            this.AsetPassword(this.password);
            this.AsetFName(obj.fname);
            this.AsetLName(obj.lname);
            this.AsetActive(obj.active);
            this.AsetID(obj.id);
            this.AsetLoggedIn(true);
          }
        });
      },
      signOut() {
        this.resetLoginData();
        this.$router.push('/login')
      },
      resetLoginData() {
        this.AsetEmail("");
        this.AsetPassword("");
        this.AsetFName("");
        this.AsetLName("");
        this.AsetLoggedIn(false);
        this.AsetID(0);
        this.AsetActive(0);
      }
    }
  }
</script>

<style>
    body {
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      line-height: 1.6;
      background: #e8f7f0;
    }
</style>

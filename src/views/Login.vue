<template>
    <div id="login">
        <b-container>
            <b-row align-h="center" class="mt-5">
                <b-col cols="5">
                    <b-alert
                            :show="dismissCountDown"
                            dismissible
                            variant="danger"
                            @dismissed="dismissCountDown=0"
                            @dismiss-count-down="countDownChanged"
                    >
                        <p>Invalid login</p>
                        <b-progress
                                variant="danger"
                                :max="dismissSecs"
                                :value="dismissCountDown"
                                height="4px"
                        ></b-progress>
                    </b-alert>
                    <b-card class="p-3">
                        <h3 class="mb-4">Login</h3>
                        <b-form @submit="onSubmit">
                            <b-form-group id="input-group-1" label="Email address:" label-for="input-1">
                                <b-form-input
                                        id="input-1"
                                        v-model="form.email"
                                        type="email"
                                        required
                                        placeholder="Enter email"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-2" label="Password:" label-for="input-2">
                                <b-form-input
                                        id="input-2"
                                        v-model="form.password"
                                        type="password"
                                        required
                                        placeholder="Enter password"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-4">
                                <b-form-checkbox v-model="form.remember">Remember</b-form-checkbox>
                            </b-form-group>

                            <b-row>
                                <b-col cols="4" class="pb-2">
                                    <b-button type="submit" variant="primary">Log In</b-button>
                                </b-col>
                                <b-col cols="4" offset="4" class="pb-2">
                                    <input type="button" class="btn btn-warning" @click="onRegister" value="Sign Up">
                                </b-col>
                            </b-row>
                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import config from '@/config'
    import { mapGetters, mapActions } from "vuex";

    export default {
        name: "login",
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                    remember: false
                },
                dismissSecs: 10,
                dismissCountDown: 0
            }
        },
        created() {
            this.checkIfLoggedIn()
        },
        computed: {
            ...mapGetters(["getLoggedIn"])
        },
        methods: {
            ...mapActions(["AsetFName", "AsetLName", "AsetEmail", "AsetPassword", "AsetLoggedIn", "AsetActive", "AsetID"]),
            onSubmit(evt) {
                evt.preventDefault();
                axios.post(`${config.uri}/user/check.php`, {
                    email: this.form.email,
                    password: this.form.password
                })
                .then(response => {
                    if (response.data.output.message === "Not found") {
                        this.showAlert();
                    } else {
                        if (this.form.remember) {
                            this.$cookies.set('email', this.form.email, "1d");
                            this.$cookies.set('password', this.form.password, "1d");
                        }
                        let obj = response.data.output.message;
                        this.AsetEmail(this.form.email);
                        this.AsetPassword(this.form.password);
                        this.AsetFName(obj.fname);
                        this.AsetLName(obj.lname);
                        this.AsetActive(obj.active);
                        this.AsetID(obj.id);
                        this.AsetLoggedIn(true);
                        this.$router.push('/');
                    }
                });
            },
            onRegister() {
                this.$router.push('/register');
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
            checkIfLoggedIn() {
                if (this.getLoggedIn) {
                    this.$router.push('/');
                }
            }
        }
    }
</script>

<style scoped>

</style>
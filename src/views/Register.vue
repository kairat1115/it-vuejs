<template>
    <div id="register">
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
                        <p>User already exists.</p>
                        <b-progress
                                variant="danger"
                                :max="dismissSecs"
                                :value="dismissCountDown"
                                height="4px"
                        ></b-progress>
                    </b-alert>
                    <div v-if="errors.email">
                        <b-alert variant="danger" show>Invalid Email!</b-alert>
                    </div>
                    <div v-if="errors.password">
                        <b-alert variant="danger" show>Passwords mismatch!</b-alert>
                    </div>
                    <b-card class="p-3">
                        <h3 class="mb-4">Register</h3>
                        <b-form @submit="onSubmit" @input="checkForm">
                            <b-form-group id="input-group-1" label="Email first name:" label-for="input-1">
                                <b-form-input
                                        id="input-1"
                                        v-model="form.fname"
                                        type="text"
                                        required
                                        placeholder="Enter first name"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-2" label="Email last name:" label-for="input-2">
                                <b-form-input
                                        id="input-2"
                                        v-model="form.lname"
                                        type="text"
                                        required
                                        placeholder="Enter last name"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-3" label="Email address:" label-for="input-3">
                                <b-form-input
                                        id="input-3"
                                        v-model="form.email"
                                        type="email"
                                        required
                                        placeholder="Enter email"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-4" label="Password:" label-for="input-4">
                                <b-form-input
                                        id="input-4"
                                        v-model="form.password1"
                                        type="password"
                                        required
                                        placeholder="Enter password"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-5" label="Repeat Password:" label-for="input-4">
                                <b-form-input
                                        id="input-5"
                                        v-model="form.password2"
                                        type="password"
                                        required
                                        placeholder="Enter password"
                                ></b-form-input>
                            </b-form-group>

                            <b-button type="submit" variant="primary">Sign Up</b-button>
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
        name: "register",
        data() {
            return {
                form: {
                    fname: '',
                    lname: '',
                    email: '',
                    password1: '',
                    password2: ''
                },
                dismissSecs: 10,
                dismissCountDown: 0,
                errors: {
                    email: false,
                    password: false
                },
                email_reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            }
        },
        created() {
            this.checkIfLoggedIn()
        },
        computed: {
            ...mapGetters(["getLoggedIn"])
        },
        methods: {
            ...mapActions(["AsetFName", "AsetLName", "AsetEmail", "AsetPassword", "AsetLoggedIn"]),
            onSubmit(evt) {
                evt.preventDefault();
                if ((this.errors.email & this.errors.password) !== 0) {
                    return
                }
                axios.post(`${config.uri}/user/create.php`, {
                    fname: this.form.fname,
                    lname: this.form.lname,
                    email: this.form.email,
                    password: this.form.password1
                })
                    .then(response => {
                        if (response.data.output.message === "User not created") {
                            this.showAlert();
                        } else {
                            this.$router.push('/login');
                        }
                    });
            },
            checkIfLoggedIn() {
                if (this.getLoggedIn) {
                    this.$router.push('/');
                }
            },
            checkForm() {
                if (this.form.email !== "") {
                    this.errors.email = !this.email_reg.test(this.form.email)
                } else {
                    this.errors.email = false;
                }
                if (this.form.password1 !== "" || this.form.password2 !== "") {
                    this.errors.password = !(this.form.password1 === this.form.password2)
                } else {
                    this.errors.password = false;
                }
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
        }
    }
</script>

<style scoped>

</style>
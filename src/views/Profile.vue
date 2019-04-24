<template>
    <div id="profile">
        <b-container>
            <b-row align-h="center" class="mt-5">
                <b-col cols="5">
                    <b-alert
                            :show="dismissCountDownError"
                            dismissible
                            variant="danger"
                            @dismissed="dismissCountDownError=0"
                            @dismiss-count-down="countDownChangedError"
                    >
                        <p>Error occured {{update_error}}</p>
                        <b-progress
                                variant="danger"
                                :max="dismissSecs"
                                :value="dismissCountDownError"
                                height="4px"
                        ></b-progress>
                    </b-alert>
                    <b-alert
                            :show="dismissCountDownSuccess"
                            dismissible
                            variant="success"
                            @dismissed="dismissCountDownSuccess=0"
                            @dismiss-count-down="countDownChangedSuccess"
                    >
                        <p>Profile successfully updated</p>
                        <b-progress
                                variant="success"
                                :max="dismissSecs"
                                :value="dismissCountDownSuccess"
                                height="4px"
                        ></b-progress>
                    </b-alert>
                    <b-card class="p-3">
                        <h3 class="mb-4">Update profile</h3>
                        <b-form @submit="onSubmit">
                            <b-form-group id="input-group-1" label="Email address:" label-for="input-1">
                                <b-form-input
                                        id="input-1"
                                        v-model="form.email"
                                        type="email"
                                        disabled
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group id="input-group-2" label="First name:" label-for="input-2">
                                <b-form-input
                                        id="input-2"
                                        v-model="form.fname"
                                        type="text"
                                        required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group id="input-group-3" label="Last name:" label-for="input-3">
                                <b-form-input
                                        id="input-3"
                                        v-model="form.lname"
                                        type="text"
                                        required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group id="input-group-4" label="Password:" label-for="input-4">
                                <b-form-input
                                        id="input-4"
                                        v-model="form.password"
                                        type="password"
                                        required
                                ></b-form-input>
                            </b-form-group>
                            <b-button type="submit" block variant="primary">Save</b-button>
                        </b-form>
                        <br>
                        <b-form @submit="onDeactivate">
                            <div v-if="getActive">
                                <b-button type="submit" block variant="danger">Deactivate</b-button>
                            </div>
                            <div v-else>
                                <b-button type="submit" block variant="success">Activate</b-button>
                            </div>

                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import axios from "axios";
    import config from "@/config";
    import { mapGetters, mapActions } from "vuex";

    export default {
        name: "profile",
        data() {
            return {
                form: {
                    email: '',
                    fname: '',
                    lname: '',
                    password: ''
                },
                dismissSecs: 10,
                dismissCountDownError: 0,
                dismissCountDownSuccess: 0,
                update_error: ''
            }
        },
        created() {
            this.setData()
        },
        computed: {
            ...mapGetters(["getFname", "getLname", "getEmail", "getPassword", "getActive"])
        },
        methods: {
            ...mapActions(["AsetFName", "AsetLName", "AsetEmail", "AsetPassword", "AsetActive"]),
            setData() {
                this.form.email = this.getEmail;
                this.form.fname = this.getFname;
                this.form.lname = this.getLname;
                this.form.password = this.getPassword;
            },
            countDownChangedError(dismissCountDownError) {
                this.dismissCountDownError = dismissCountDownError
            },
            countDownChangedSuccess(dismissCountDownSuccess) {
                this.dismissCountDownSuccess = dismissCountDownSuccess
            },
            showError() {
                this.dismissCountDownError = this.dismissSecs
            },
            showSuccess() {
                this.dismissCountDownSuccess = this.dismissSecs
            },
            onSubmit(evt) {
                evt.preventDefault();
                let payload = {
                    email: this.getEmail
                };
                if (this.getFname !== this.form.fname) {
                    payload.fname = this.form.fname
                }
                if (this.getLname !== this.form.lname) {
                    payload.lname = this.form.lname
                }
                if (this.getPassword !== this.form.password) {
                    payload.password = this.form.password
                }
                axios.put(`${config.uri}/user/update.php`, payload)
                .then(response => {
                    let data = response.data;
                    if (data.output.message === "User updated successfully") {
                        this.AsetPassword(this.form.password);
                        this.AsetFName(this.form.fname);
                        this.AsetLName(this.form.lname);
                        this.showSuccess();
                    } else {
                        this.update_error = data.error;
                        this.showError();
                    }
                });
            },
            onDeactivate(evt) {
                evt.preventDefault();
                let active = (this.getActive) ? 0 : 1;
                let payload = {
                    email: this.getEmail,
                    active
                };
                axios.put(`${config.uri}/user/update.php`, payload)
                .then(response => {
                    let data = response.data;
                    if (data.output.message === "User updated successfully") {
                        this.AsetActive(active);
                        this.showSuccess();
                    } else {
                        this.update_error = data.error;
                        this.showError();
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
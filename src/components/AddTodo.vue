<template>
    <div id="AddTodo">
        <h3>Add Todo</h3>
        <div class="add">
            <b-alert v-model="errorState" variant="danger" dismissible>{{ this.errorMsg }}</b-alert>
            <form @submit="onSubmit">
                <input type="text" v-model="title" placeholder="Add Todo...">
                <input type="submit" value="Submit">
            </form>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: "AddTodo",
        data() {
            return {
                title: "",
                errorState: false,
                errorMsg: ''
            };
        },
        methods: {
            ...mapActions(["AaddTodo"]),
            onSubmit(e) {
                e.preventDefault();
                this.AaddTodo(this.title)
                    .then((response) => {
                        if (response === 'Ok')
                            this.title = '';
                        else
                            this.showError(response);
                    });
            },
            showError(e) {
                this.errorMsg = e;
                this.errorState = true;
            }
        }
    }
</script>

<style scoped>
    form {
        display: flex;
    }
    input[type="text"] {
        flex: 10;
        padding: 10px;
        border: 1px solid #41b883;
        outline: 0;
    }
    input[type="submit"] {
        flex: 2;
        background: #41b883;
        color: #fff;
        border: 1px solid #41b883;
        cursor: pointer;
    }
</style>
<template>
    <div id="Todos">
        <div class="legend">
            <span>Double click to mark as complete</span>
            <span>
                <span class="incomplete-box"></span> Incomplete
            </span>
            <span>
                <span class="complete-box"></span> Complete
            </span>
        </div>
        <div class="todos">
            <b-alert v-model="errorState" variant="danger" dismissible>{{ this.errorMsg }}</b-alert>
            <div
                    v-for="todo in getAllTodos"
                    :key="todo.id"
                    class="todo"
                    @dblclick="getActive !== 0 && onDblClick(todo)"
                    v-bind:class="{'is-complete':todo.completed}"
            >
                <input
                        type="text"
                        :disabled="true"
                        v-model="todo.title"
                        style="background: transparent; text-align: center; border: none; color:black"
                        :ref="'input_' + todo.id"
                        @blur="updateTodo(todo)"
                        v-on:keyup.enter="updateTodo(todo)"
                >
                <div class="ileft" v-if="getActive !== 0">
                    <i @click="editTodo(todo)" class="fas fa-edit"></i>
                </div>
                <div class="iright" v-if="getActive !== 0">
                    <i @click="AdeleteTodo(todo.id)" class="fas fa-trash-alt"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";

    export default {
        name: "Todos",
        data() {
            return {
                errorState: false,
                errorMsg: ''
            }
        },
        computed: {
            ...mapGetters(["getAllTodos", "getActive"])
        },
        methods: {
            ...mapActions(["AfetchTodos", "AdeleteTodo", "AupdateTodo"]),
            onDblClick(todo) {
                const updTodo = {
                    id: todo.id,
                    title: todo.title,
                    completed: !todo.completed
                };
                this.AupdateTodo(updTodo)
                    .then(response=>{
                        if (response !== 'Ok') {
                            this.showError(response);
                        }
                    });
            },
            editTodo(todo) {
                let element = this.$refs['input_' + todo.id][0];
                element.disabled = false;
                this.$nextTick(() => {
                    element.focus();
                });
            },
            updateTodo(todo) {
                let element = this.$refs['input_' + todo.id][0];
                element.disabled = true;
                this.AupdateTodo(todo)
                    .then(response => {
                        if (response !== 'Ok') {
                            this.showError(response)
                        }
                    })
            },
            showError(e) {
                this.errorMsg = e;
                this.errorState = true;
            }
        },
        created() {
            this.AfetchTodos();
        }
    }
</script>

<style scoped>
    .todos {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1rem;
    }

    .todo {
        border: 1px solid #ccc;
        background: #41b883;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }

    .iright {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #fff;
        cursor: pointer;
    }

    .ileft {
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: #fff;
        cursor: pointer;
    }

    .legend {
        display: flex;
        justify-content: space-around;
        margin-bottom: 1rem;
    }

    .complete-box {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #35495e;
    }

    .incomplete-box {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #41b883;
    }

    .is-complete {
        background: #35495e;
        color: #fff;
    }
</style>
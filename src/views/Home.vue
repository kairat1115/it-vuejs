<template>
    <div id="home">
        <b-container>
            <br>
            <AddTodo/>
            <br>
            <FilterTodos/>
            <br>
            <Todos/>
        </b-container>
    </div>
</template>

<script>
    import Todos from "@/components/Todos";
    import AddTodo from "@/components/AddTodo";
    import FilterTodos from "@/components/FilterTodos";

    export default {
        name: "home",
        components: {
            Todos,
            AddTodo,
            FilterTodos
        }
    }
</script>

<style scoped>

</style>
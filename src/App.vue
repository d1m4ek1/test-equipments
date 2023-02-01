<template>
  <main>
    <div class="wrapper">
      <h1>Оборудование</h1>
      <hr />
      <FormAdd />
      <hr />
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped>
hr {
  border-radius: 3px;
  width: 100%;
  height: 3px;
  background-color: rgb(180, 180, 180);
  border: none;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>

<script>
import FormAdd from "./components/FormAdd.vue";

export default {
  components: {
    FormAdd,
  },
};
</script>
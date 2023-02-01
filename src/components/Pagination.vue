<template>
  <ul class="pagination_items">
    <template v-for="page in totalPages" :key="`${page}_page`">
      <li
        class="pagination_item"
        :class="{
          active_pagination_item:
            page === ($route.query.page === undefined ? 1 : +$route.query.page),
        }"
        @click="goToPagination(page)"
      >
        {{ page }}
      </li>
    </template>
  </ul>
</template>

<style scoped>
.pagination_items {
  width: 100%;
  height: 30px;
  display: flex;
}

.pagination_item {
  border-radius: 50%;
  height: 30px;
  width: 30px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.pagination_item:not(:last-child) {
  margin-right: 15px;
}

li {
  list-style: none;
}

.active_pagination_item {
  background-color: black;
  color: white;
}
</style>

<script>
import router from "../router/roter";

export default {
  props: {
    totalPages: Number,
  },
  name: "Pagination",
  methods: {
    goToPagination(idx) {
      router.push({ name: "pagination", query: { page: idx } });
    },
  },
  created() {},
};
</script>
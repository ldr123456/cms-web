<template>
  <div>
    <Paper :type="type" :name="name" :sort="sort"></Paper>
  </div>
</template>

<script setup>
import Paper from "@/components/edit/rePaper.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const name = ref(route.query.name); // 试卷名称
const type = ref(route.query.type); // 组卷方式
const sort = ref(route.query.sort); // 试卷分类
</script>

<style scoped></style>

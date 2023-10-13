<!-- 修改试卷 -->
<template>
	<div>
		<Paper :ID="route.params.id"></Paper>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import Paper from "@/components/edit/Paper.vue";
const route = useRoute();
</script>
<template>
  <div>
    <EditExam :numb="numb" :skip="skip"></EditExam>
  </div>
</template>

<script>
export default {
  name: "editExam",
}
</script>

<script setup>
import { useRoute } from "vue-router"
import { ref } from "vue"
import EditExam from "@/components/edit/EditExam.vue"
const route = useRoute()
const numb = ref(route.params.id)
// 保存表单要跳转的链接
const skip = ref('exam')

</script>

<style lang="scss" scoped>
</style>

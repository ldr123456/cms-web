<template>
  <div class="contentbox">
    <h2>课程描述</h2>
    <Description ref="description" :isAdd="true" />
    <h2>权限配置</h2>
    <SelectAuth ref="selectAuth" :isAdd="true" />
    <h2>课件列表</h2>
    <WareLists ref="wareLists" :isAdd="true" />
    <div class="buttons">
      <el-button type="primary" size="large" @click="save">保存</el-button>
      <el-button type="info" size="large" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Description from "../components/Description.vue";
import SelectAuth from "../components/SelectAuth.vue";
import WareLists from "../components/WareLists.vue";
import { createLesson } from "@/api/course.js";
import { ElMessage } from "element-plus";
import { async } from "q";

const state = reactive({
  courseData: {},
});
const router = useRouter();
const description = ref();
const selectAuth = ref();
const wareLists = ref();
const save = async () => {
  // 是否为必修
  description.value.description.compulsoryTypeID = description.value.description
    .compulsoryTypeID
    ? 1
    : 0;
  // 课件列表
  const lessonChapterDetailInfos = [];
  wareLists.value.tableData.forEach((item) => {
    const lessonWareIds = [];
    item.children.forEach((value) => {
      lessonWareIds.push(value.ID);
    });
    lessonChapterDetailInfos.push({
      lessonChapterDetail: {
        label: item.label,
        lessonWareIds,
      },
    });
  });
  state.courseData = {
    ...description.value.description,
    permissionTypeID: selectAuth.value.authId,
    permissionDepartmentArr: selectAuth.value.checkedArray,
    permissionPersonArr: selectAuth.value.selectUserIDs,
    lessonChapterDetailInfos,
  };

  description.value.ruleFormRef.validate(async (valid) => {
    if (valid) {
      if (lessonChapterDetailInfos.length === 0) {
        ElMessage.error("请完善课件列表");
      } else {
        // 创建课程
        const { code, msg } = await createLesson(state.courseData);
        if (code === 0) {
          router.push({ name: "coursemanage" });
          ElMessage.success(msg);
        }
      }
    } else {
      ElMessage.error("请完善描述信息");
    }
  });
};
const back = () => {
  router.push({ name: "coursemanage" });
};
</script>

<style lang="scss" scoped>
.buttons {
  margin-top: 10px;
}
</style>

<style lang="scss"></style>

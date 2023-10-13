<template>
  <div class="contentbox">
    <h2>课程描述</h2>
    <Description
      ref="description"
      :isAdd="false"
      :description="state.descriptionValue"
      v-if="state.descriptionValue"
    />
    <h2>权限配置</h2>
    <SelectAuth
      ref="selectAuth"
      :isAdd="false"
      :selectAuth="state.selectAuthValue"
      v-if="state.selectAuthValue"
    />
    <h2>课件列表</h2>
    <WareLists
      ref="wareLists"
      :isAdd="false"
      :wareLists="state.wareListsValue"
      v-if="state.wareListsValue"
    />
    <div class="buttons">
      <el-button type="primary" size="large" @click="save">保存</el-button>
      <el-button type="info" size="large" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import Description from "../components/Description.vue";
import SelectAuth from "../components/SelectAuth.vue";
import WareLists from "../components/WareLists.vue";
import { getCourseDetail, modifyLesson } from "@/api/course.js";
import { async } from "q";
import { ElMessage } from "element-plus";
const state = reactive({
  courseData: {},
  descriptionValue: {},
  selectAuthValue: {},
  wareListsValue: [],
});
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const { data } = await getCourseDetail({ id: route.params.id });
  state.descriptionValue = {
    name: data.name, //课程名称
    lessonTypeId: data.lessonTypeID, //课程分类
    compulsoryTypeID: data.compulsoryTypeID === 1, //课程是否必修
    price: data.price, //课程售价
    isLimitExamDur: data.isLimitExamDur, //是否限制学习时间
    startTime: data.startTime, //开始时间
    endTime: data.endTime, //结束时间
    integral: data.integral, //学完积分
    pictureUrl: data.pictureUrl, //课程封面
    content: data.content, //柯城内容
    studyHour: data.studyHour, //课程学时
  };
  state.selectAuthValue = {
    authId: data.permissionTypeId,
    checkedArray: data.permission_dept_id,
    selectData: data.permission_user_id ? data.permission_user_id : [],
  };
  state.wareListsValue = [];
  data.lesson_chapter_details.forEach((item) => {
    if (item.lessonWares) {
      item.lessonWares = item.lessonWares.map((value) => {
        return {
          ...value,
          minute: value.duration / 60,
          second: value.duration % 60,
        };
      });
      state.wareListsValue.push({
        label: item.label,
        children: [...item.lessonWares],
      });
    }
  });
});
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
    id: Number(route.params.id),
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
        // 修改课程
        const { code, msg } = await modifyLesson(state.courseData);
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

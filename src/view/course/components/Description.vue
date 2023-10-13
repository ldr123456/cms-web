<template>
  <div>
    <el-card>
      <div class="container">
        <el-form
          :model="description"
          :rules="rules"
          ref="ruleFormRef"
          label-width="100px"
        >
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="description.name" />
          </el-form-item>
          <el-form-item label="学习时间" style="width: 40%">
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="changeTime"
            />
          </el-form-item>
          <el-form-item label="课程分类" prop="lessonTypeId">
            <el-cascader
              v-model="description.lessonTypeId"
              placeholder="请选择课程分类"
              :options="WareCate"
              :show-all-levels="false"
              @change="onCateChange"
              :props="{ multiple: false, checkStrictly: true, emitPath: false }"
              clearable
            />
          </el-form-item>
          <el-form-item label="必修课程" prop="compulsoryTypeID">
            <el-switch
              v-model="description.compulsoryTypeID"
              @change="compulsoryChange"
            />
          </el-form-item>
          <el-form-item label="学完积分">
            <el-input-number
              v-model="description.integral"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="课程课时">
            <el-input-number
              v-model="description.studyHour"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="课程封面">
            <el-upload
              v-model:file-list="fileList"
              action
              :http-request="uploadFile"
              :headers="{
                'x-token': token,
              }"
              list-type="picture-card"
              :before-upload="handleBeforeUpload"
              :replace="true"
              :on-change="onChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程内容" prop="content">
            <div style="margin-top: 20px">
              <TEditor ref="editor" v-model="description.content" />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getLessonTypeList } from "../../../api/course.js";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { uploadImage } from "../../../api/upload";
import TEditor from "../../../components/tinymce/TEditor.vue";

const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          ID: item.ID,
          label: item.label,
          value: item.ID,
          children: [],
        };
        setAuthorityOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          ID: item.ID,
          label: item.label,
          value: item.ID,
        };
        optionsData.push(option);
      }
    });
};
// 获取课程分类
const getAllLesson = async () => {
  const { data } = await getLessonTypeList({
    ID: 29,
  });
  setAuthorityOptions(
    data.sysDictionary.sysSortDictionaryDetails,
    WareCate.value
  );
};
onMounted(() => {
  getAllLesson();
});
const props = defineProps(["description"]);
watch(
  () => props.description,
  () => {
    if (!props.isAdd) {
      description.value = { ...props.description };
      console.log(description.value.content);
      fileList.value.push({
        url: description.value.pictureUrl,
      });
      dateValue.value = [
        description.value.startTime,
        description.value.endTime,
      ];
    }
  }
);
const token = localStorage.getItem("token");
const WareCate = ref([]);
//课程描述
const description = ref({
  name: "", //课程名称
  lessonTypeId: "", //课程分类
  compulsoryTypeID: false, //课程是否必修
  price: 0, //课程售价
  isLimitExamDur: false, //是否限制学习时间
  startTime: "", //开始时间
  endTime: "", //结束时间
  integral: 0, //学完积分
  pictureUrl: "", //课程封面
  content: "", //柯城内容
  studyHour: 0, //课程学时
});
const ruleFormRef = ref();
const rules = reactive({
  name: [{ required: true, message: "请填入课程名称", trigger: "blur" }],
  lessonTypeId: [
    { required: true, message: "请填入课程分类", trigger: "blur" },
  ],
  compulsoryTypeID: [
    { required: true, message: "请选择是否为必修", trigger: "blur" },
  ],
  content: [{ required: true, message: "请填入课程内容", trigger: "blur" }],
});
// 开始时间和结束时间
const dateValue = ref("");
const changeTime = (value) => {
  description.value.startTime = new Date(value[0]).toISOString();
  description.value.endTime = new Date(value[1]).toISOString();
};
// 必修选修切换
const compulsoryChange = (val) => {
  description.value.compulsoryTypeID = val;
};

// upload绑定的列表 存有上传的图片的本地信息
const fileList = ref([]);
// 检查上传是否为图片
const handleBeforeUpload = (file) => {
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("文件格式错误");
    return false;
  }
};
//上传文件
const uploadFile = async (item) => {
  let formData = new FormData();
  formData.append("file", item.file);
  const {
    data: { file },
  } = await uploadImage(formData);
  console.log(file, "url");
  description.value.pictureUrl = file.url;
};
const onChange = (file, fileList) => {
  console.log(fileList);
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
};
//课程分类
const onCateChange = (id) => {
  description.value.lessonTypeId = id;
};

defineExpose({
  description,
  ruleFormRef,
});
</script>

<style lang="scss" scoped>
.contentbox {
  margin-top: 110px;
  .container {
    width: 100%;
    padding-top: 10px;
  }
}
</style>

<style lang="scss">
.container {
  .el-input {
    width: 300px;
  }
}
</style>

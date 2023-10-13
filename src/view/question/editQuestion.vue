<!-- 编辑试题 -->
<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <el-form
        ref="ruleFormRef"
        :model="questionForm"
        :rules="rules"
        label-width="120px"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="试题类型" prop="quType">
              <el-select
                v-model="questionForm.quType"
                placeholder="请选择试题类型"
                clearable
                @change="questionChange"
              >
                <el-option
                  v-for="item in questionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属题库" prop="questionBankID">
              <el-select
                v-model="questionForm.questionBankID"
                placeholder="请选择题库"
                clearable
              >
                <el-option
                  v-for="item in questionBank"
                  :key="item.ID"
                  :label="item.qb_name"
                  :value="item.ID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="level">
              <el-select v-model="questionForm.level" placeholder="请选择难度" clearable>
                <el-option
                  v-for="item in questionLevel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属章节">
              <el-select
                v-model="questionForm.chapter"
                placeholder="请选择章节"
                clearable
              >
                <el-option label="章节1" value="0" />
                <el-option label="章节2" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="试题内容" prop="content">
              <div style="border: 1px solid #ccc; margin-top: 20px">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorCon"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                />
                <Editor
                  style="height: 300px; overflow-y: hidden"
                  v-model="questionForm.content"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="handleCreatedCon"
                  @onChange="handleEditChange"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <el-form-item label="整题解析" prop="analysis">
              <div style="border: 1px solid #ccc; margin-top: 20px">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorAn"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                />
                <Editor
                  style="height: 300px; overflow-y: hidden"
                  v-model="questionForm.analysis"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="handleCreatedAn"
                  @onChange="handleEditChange"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div v-if="showOption">
              <el-button
                type="primary"
                icon="Plus"
                :disabled="questionForm.quType == 3"
                @click="addAnswer"
              >
                添加选项
              </el-button>
              <el-table
                ref="multipleTable"
                :data="questionForm.answerList"
                border
                style="width: 100%"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="is_right"
                  v-if="questionForm.quType != 4"
                  label="是否答案"
                  min-width="60"
                >
                  <template #default="{ row }">
                    <div>
                      <el-checkbox
                        v-model="row.is_right"
                        label="答案"
                        @change="rightChange(row.index)"
                      ></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="image"
                  v-if="questionForm.quType != 4"
                  label="选项图片"
                  min-width="100"
                >
                  <!-- <template #default="{ row }">
                  <div></div>
                </template> -->
                </el-table-column>
                <el-table-column prop="image" label="选项内容" min-width="250">
                  <template #default="{ row }">
                    <el-input type="textarea" v-model="row.content"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="image"
                  v-if="questionForm.quType != 4"
                  label="选项解析"
                  min-width="250"
                >
                  <template #default="{ row }">
                    <el-input type="textarea" v-model="row.analysis"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="50">
                  <template #default="{ row }">
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="deleteAnswer(row.index)"
                      circle
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-checkbox
                v-model="fillSort"
                v-if="questionForm.quType == 4"
                label="严格按序作答"
                size="large"
              />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="btns">
      <el-button type="primary" @click="subQuestion(ruleFormRef)">保存</el-button>
      <el-button
        type="info"
        @click="
          () => {
            router.push({ name: 'testManage' });
          }
        "
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "editQuestion",
};
</script>

<script setup>
import { ref, reactive, onBeforeUnmount, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { findExamQuestion, createQuestion, updateQuestion } from "@/api/testManage.js";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getAllExamQuestionBank } from "@/api/questionBank.js";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
const route = useRoute();
const router = useRouter();
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
// 获取题库信息
const initQuestionBankList = async () => {
  const { data } = await getAllExamQuestionBank({});
  questionBank.value = data.list;
};
// 获取试题信息
const getQuInfo = async () => {
  const { data } = await findExamQuestion({ ID: route.params.id });
  questionForm.value = data.resExamQuestion;
  if (questionForm.value.quType != 5 && questionForm.value.quType != 6) {
    showOption.value = true;
  } else {
    showOption.value = false;
  }
  if (questionForm.quType == 4) {
    questionForm.value.answerList.forEach((item) => {
      item.is_right = true;
    });
  }
};
// 题型
const questionType = ref([]);
// 试题难度等级
const questionLevel = ref([]);
// 题库信息
const questionBank = ref([]);
// 初始化页面
const initEditQu = async () => {
  initDataDictionary(questionType, 9);
  initDataDictionary(questionLevel, 10);
  initQuestionBankList();
  if (route.params.id != 0) {
    getQuInfo();
  }
};
// 表单数据
const ruleFormRef = ref();
const questionForm = ref({
  quType: "", // 题型
  questionBankID: "", // 题库
  level: "", // 难度
  // chapter: "", // 章节
  content: "", // 题意
  subQuType: "",
  analysis: "", // 解析
  answerList: [], // 选项
});
// 表单校验规则
const rules = reactive({
  quType: [{ required: true, message: "试题类型不能为空！", trigger: "change" }],
  questionBankID: [{ required: true, message: "请选择题库！", trigger: "change" }],
  level: [{ required: true, message: "必须选择难度等级！", trigger: "change" }],
  content: [{ required: true, message: "试题内容不能为空！", trigger: "change" }],
});
// 控制选项出现
const showOption = ref(false);
// 输入框内容改变
const questionChange = () => {
  if (!questionForm.value.quType) {
    return;
  }
  questionForm.value.answerList = [];
  if (questionForm.value.quType != 5 && questionForm.value.quType != 6) {
    addAnswer();
    addAnswer();
    showOption.value = true;
  } else {
    showOption.value = false;
  }
  if (questionForm.quType == 4) {
    questionForm.value.answerList.forEach((item) => {
      item.is_right = true;
    });
  }
};
// 编辑器实例，必须用 shallowRef
const editorCon = shallowRef();
const editorAn = shallowRef();

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor1 = editorCon.value;
  const editor2 = editorCon.value;
  if (editor1 == null || editor2 == null) return;
  editor1.destroy();
  editor2.destroy();
});
const handleCreatedCon = (editor) => {
  editorCon.value = editor; // 记录 editor 实例，重要！
};
const handleCreatedAn = (editor) => {
  editorAn.value = editor; // 记录 editor 实例，重要！
};
// 编辑区内容变化
const handleEditChange = (e) => {
  // console.log(e.getHtml());
};
// 为表格数据添加索引
const tableRowClassName = ({ row, rowIndex }) => {
  row.index = rowIndex;
};
// 添加选项
const addAnswer = () => {
  questionForm.value.answerList.push({
    is_right: false,
    image: "",
    analysis: "",
    content: "",
  });
  if (questionForm.quType == 4) {
    questionForm.value.answerList.forEach((item) => {
      item.is_right = true;
    });
  }
};
// 选中答案
const rightChange = (index) => {
  if (questionForm.value.quType == 1 || questionForm.value.quType == 3) {
    questionForm.value.answerList.forEach((item) => {
      item.is_right = false;
    });
    questionForm.value.answerList[index].is_right = true;
  }
};
// 删除答案
const deleteAnswer = (index) => {
  questionForm.value.answerList.splice(index, 1);
};
const fillSort = ref(false);
// 保存试题
const createQu = async () => {
  if (route.params.id != 0) {
    ElMessageBox.confirm("是否确定保存修改", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(async () => {
        const res = await updateQuestion(questionForm.value);
        ElMessage.success(res.msg);
        ElMessage({
          type: "success",
          message: "保存成功",
        });
        router.push({
          name: "testManage",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消保存",
        });
      });
  } else {
    const res = await createQuestion(questionForm.value);
    ElMessage.success(res.msg);
    ElMessageBox.confirm("请选择接下来的操作", {
      distinguishCancelAndClose: true,
      confirmButtonText: "继续添加下一题",
      cancelButtonText: "返回试题列表",
    })
      .then(() => {
        showOption.value = false;
      })
      .catch((action) => {
        if (action === "cancel") {
          router.push({
            name: "testManage",
          });
        }
      });
  }
};
const subQuestion = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let isQuestion = true;
      if (questionForm.value.quType == 5) {
        createQu();
      } else if (questionForm.value.quType == 4) {
        questionForm.value.answerList.forEach((item, index) => {
          item.is_right = true;
          if (!item.content) {
            ElMessage.warning(`选项 ${index + 1} 必须存在内容`);
            isQuestion = false;
          }
        });
        if (isQuestion) {
          createQu();
          createQu();
        }
      } else {
        let right = 0;
        questionForm.value.answerList.forEach((item, index) => {
          if (!item.content) {
            ElMessage.warning(`选项 ${index + 1} 必须存在内容或图片`);
            isQuestion = false;
          }
          if (item.is_right) {
            right++;
          }
        });
        if (right === 0) {
          ElMessage.warning("选项至少存在一个正确答案");
          isQuestion = false;
        } else if (right < 2 && questionForm.value.quType == 2) {
          ElMessage.warning("多选题至少存在两个正确答案");
          isQuestion = false;
        }
        if (isQuestion) {
          createQu();
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 页面初始化
initEditQu();
</script>

<style scoped></style>

<!-- 试题管理 -->
<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="filter-container">
        <el-select
          v-model="form.questionBankID"
          clearable
          placeholder="选择或搜索题库"
          @change="inputChange"
        >
          <el-option
            v-for="item in questionBank"
            :key="item.ID"
            :label="item.qb_name"
            :value="item.ID"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="form.quType"
          clearable
          placeholder="请选择题型"
          @change="inputChange"
        >
          <el-option
            v-for="item in questionType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="form.content"
          placeholder="搜索考试名称"
          @input="inputChange"
        ></el-input>
        <!-- 操作按钮组 -->
        <div class="btns">
          <el-button type="primary" icon="Plus" @click="addQu">增加</el-button>
          <el-button type="warning" icon="EditPen" :disabled="editBtn" @click="editQu">
            修改
          </el-button>
          <el-button type="danger" icon="Delete" :disabled="deleteBtn" @click="deleteQu">
            删除
          </el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="examTable">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="55"> </el-table-column>
          <el-table-column
            prop="content"
            label="试题内容"
            min-width="250"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <div @click="editQu(row)">
                <a href="javascript:;" class="d-link">{{ row.content }}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="questionBankName" label="题库" min-width="250">
          </el-table-column>
          <el-table-column prop="quType" label="题型" min-width="50">
            <template #default="{ row }">
              <template v-for="item in questionType">
                <span v-if="row.quType == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="难度"
            min-width="50"
            :show-overflow-tooltip="true"
          >
            <template #default="{ row }">
              <template v-for="item in questionLevel">
                <span v-if="row.level == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="chapter"
            label="章节"
            min-width="50"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column prop="CreatedAt" label="创建时间" min-width="100">
            <template #default="{ row }">
              {{ $filters.dateFilter(row.CreatedAt) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="gva-pagination">
          <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[5, 10, 30, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "testManage",
};
</script>

<script setup>
import { ref, reactive } from "vue";
import {
  getExamQuestionList,
  deleteQuestion,
  batchDeleteQuestion,
} from "@/api/testManage.js";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllExamQuestionBank } from "@/api/questionBank.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
const router = useRouter();
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
const initQuestionBank = async (Data, id) => {
  const { data } = await getAllExamQuestionBank();
  questionBank.value = data.list;
};
// 初始化表格
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const form = reactive({
  chapter: "",
  content: "",
  questionBankID: "",
  quType: "",
});
const tableData = ref([]);
const initTable = async () => {
  const { data } = await getExamQuestionList({
    page: page.value,
    pageSize: pageSize.value,
    content: form.content,
    questionBankID: form.questionBankID,
    quType: form.quType,
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
};
// 题型
const questionType = ref([]);
// 试题难度等级
const questionLevel = ref([]);
// 题库
const questionBank = ref([]);
const initTest = () => {
  initTable();
  initDataDictionary(questionType, 9);
  initDataDictionary(questionLevel, 10);
  initQuestionBank();
};
initTest();
// 输入框信息改变
const inputChange = () => {
  initTable();
};
// 监听表格状态改变
const deleteBtn = ref(true);
const editBtn = ref(true);
let multipleSelection = reactive([]);
const handleSelectionChange = (val) => {
  multipleSelection = val;
  console.log(val);
  if (val.length === 0) {
    deleteBtn.value = true;
    editBtn.value = true;
  } else if (val.length === 1) {
    deleteBtn.value = false;
    editBtn.value = false;
  } else {
    deleteBtn.value = false;
    editBtn.value = true;
  }
};
// 添加试题
const addQu = () => {
  router.push({
    name: "editQuestion",
    params: {
      id: 0,
    },
  });
};
// 修改试题信息
const editQu = (tab) => {
  const id = tab.ID ? tab.ID : multipleSelection[0].ID;
  router.push({
    name: "editQuestion",
    // 传入选中项id
    params: {
      id: id,
    },
  });
};
// 删除选中项
const ids = ref([]);
const message = ref("");
const deleteQu = () => {
  if (multipleSelection.length > 1) {
    ids.value = [];
    multipleSelection.forEach((item) => {
      ids.value.push(item.ID);
    });
    message.value = "此操作将永久删除多个试题, 是否继续?";
  } else {
    message.value = "此操作将永久删除该试题, 是否继续?";
  }
  ElMessageBox.confirm(message.value, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      if (multipleSelection.length > 1) {
        const res = await batchDeleteQuestion({
          ids: ids.value,
        });
      } else {
        const res = await deleteQuestion({
          ID: multipleSelection[0].ID,
        });
      }
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
      if (tableData.value.length === 1 && page.value > 1) {
        page.value--;
      }
      initTable();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val; // 每页显示个数
  initTable();
};
const handleCurrentChange = (val) => {
  page.value = val; // 当前页
  initTable();
};
</script>

<style lang="scss" scoped>
@import "@/style/element_visiable.scss";
.filter-container {
  margin-bottom: 10px;
  /* 样式穿透 */
  :deep(.el-input),
  :deep(.el-select) {
    width: 180px;
    height: 36px;
    line-height: 36px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
// 链接
.d-link {
  color: #1890ff;
  font-weight: 700;
}
.d-link:hover {
  color: #ff8000;
}
</style>

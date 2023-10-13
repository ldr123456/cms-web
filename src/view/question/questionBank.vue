<!-- 题库管理 -->
<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="filter-container">
        <el-cascader
          v-model="selectInput.qb_type"
          :options="questionBankSort"
          :show-all-levelsp="false"
          @change="inputChange"
          :props="{
            checkStrictly: true,
            emitPath: false,
            label: 'label',
            value: 'label',
          }"
          clearable
        />
        <el-input
          v-model="selectInput.qb_name"
          placeholder="请输入题库名称"
          @input="inputChange"
        />
        <el-checkbox
          v-model="selectInput.is_exam"
          label="用于考试"
          @change="inputChange"
        />
        <el-checkbox
          v-model="selectInput.is_train"
          label="用于训练"
          @change="inputChange"
        />
        <!-- 操作按钮组 -->
        <div class="btns">
          <el-button type="primary" icon="Plus" @click="addBank"
            >增加</el-button
          >
          <el-button
            type="warning"
            icon="EditPen"
            :disabled="updateBtn"
            @click="editBank"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            :disabled="deleteBtn"
            @click="deleteBank"
          >
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
            prop="qb_name"
            label="题库名称"
            min-width="200"
            :show-overflow-tooltip="true"
          >
            <template #default="{ row }">
              <a href="javascript:;" class="d-link" @click="editBank(row)">
                {{ row.qb_name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="train_open_type_dict_text"
            label="开放类型"
            min-width=""
          >
          </el-table-column>
          <el-table-column prop="qb_type" label="题库分类" min-width="200">
          </el-table-column>
          <el-table-column prop="question_number" label="试题总数" min-width="">
          </el-table-column>
          <el-table-column
            prop="obj_question_number"
            label="客观题数量"
            min-width=""
          >
          </el-table-column>
          <el-table-column
            prop="sub_question_number"
            label="主观题数量"
            min-width=""
          ></el-table-column>
          <el-table-column prop="is_exam" label="用于考试" min-width="">
            <template #default="{ row }">
              <span v-if="row.is_exam" style="color: green">是</span>
              <span v-else style="color: red">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="is_train" label="用于训练" min-width="">
            <template #default="{ row }">
              <span v-if="row.is_train" style="color: green">是</span>
              <span v-else style="color: red">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="CreatedAt" label="创建时间" min-width="150">
            <template #default="{ row }">
              {{ $filters.dateFilter(row.CreatedAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="100">
            <el-link type="primary" icon="Document" :underline="false"
              >试题管理</el-link
            >
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
  name: 'questionBank',
}
</script>

<script setup>
import { reactive, ref } from 'vue'
import {
  getExamQuestionBankList,
  batchDeleteQuestionBank,
} from '@/api/questionBank.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findSysSortDictionary } from '@/api/sysSortDictionary.js'
import { useRouter } from 'vue-router'
// 题库分类
const questionBankSort = ref([])
const initSort = async () => {
  const { data } = await findSysSortDictionary({ ID: 27 })
  questionBankSort.value = data.sysDictionary.sysSortDictionaryDetails
}
// 接收输入框数据(类型、权限、开始时间、结束时间、考试名称)
const selectInput = reactive({
  qb_type: '',
  qb_name: '',
  is_exam: false,
  is_train: false,
})
// 表格数据
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref()
// 获取题库信息
const getAllBank = async () => {
  const { data } = await getExamQuestionBankList({
    page: page.value,
    pageSize: pageSize.value,
    qb_type: selectInput.qb_type,
    qb_name: selectInput.qb_name,
    is_exam: selectInput.is_exam,
    is_train: selectInput.is_train,
  })
  tableData.value = data.list
  page.value = data.page
  pageSize.value = data.pageSize
  total.value = data.total
  ElMessage.success('数据获取成功')
}
getAllBank()
initSort()
let multipleSelection = reactive([])
const updateBtn = ref(true)
const deleteBtn = ref(true)
// 监听表格状态改变
const handleSelectionChange = (val) => {
  multipleSelection = val
  if (val.length === 1) updateBtn.value = false
  else updateBtn.value = true
  if (val.length === 0) {
    deleteBtn.value = true
  } else {
    deleteBtn.value = false
  }
}
const router = useRouter()
// 添加题库
const addBank = () => {
  router.push({
    name: 'updateBank',
    params: {
      id: 0,
    },
  })
}
// 修改题库信息
const editBank = (tab) => {
  // console.log(typeof tab.ID)
  const id = tab.ID ? tab.ID : multipleSelection[0].ID
  router.push({
    name: 'updateBank',
    // 传入选中项id
    params: {
      id: id,
    },
  })
}
// 删除选中项
const deleteBank = () => {
  ElMessageBox.confirm('此操作将永久删除该题库, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = []
      multipleSelection.forEach((item) => {
        ids.push(item.ID)
      })
      const res = await batchDeleteQuestionBank({
        ids: ids,
      })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getAllBank()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val // 每页显示个数
  getAllBank()
}
const handleCurrentChange = (val) => {
  page.value = val // 当前页
  getAllBank()
}
// 监听输入框改变
const inputChange = (val) => {
  getAllBank()
}
</script>

<style lang="scss" scoped>
// @import "@/style/element_visiable.scss";
.filter-container {
  margin-bottom: 10px;
  justify-content: center;
}

/* 样式穿透 */
:deep(.el-input),
:deep(.el-select) {
  width: 250px;
  height: 36px;
  line-height: 36px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-link {
  margin: 0 5px;
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

<!-- 试卷管理 -->
<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="filter-container">
        <el-select
          v-model="examType"
          clearable
          placeholder="请选择分类"
          class="filter-item"
        >
          <el-option
            v-for="item in option1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="personType"
          clearable
          placeholder="请选择"
          class="filter-item"
        >
          <el-option
            v-for="item in typeRadios"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="examName"
          placeholder="试卷名称"
          class="filter-item"
        ></el-input>
        <!-- 操作按钮组 -->
        <div class="btns">
          <el-button type="primary" icon="Plus" @click="dialogVisible = true;">增加</el-button>
          <el-button type="warning" icon="EditPen" @click="editPaper" :disabled="isDisable">修改</el-button>
          <el-button
            type="danger"
            icon="Delete"
            :disabled="isDisable"
            @click="deletePaper"
            >删除</el-button
          >
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
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="name"
            label="试卷名称"
            min-width="400"
            :show-overflow-tooltip="true"
          >
          <template #default="{ row }">
              <a href="javascript:;" class="d-link" @click="editPaper(row)">
                {{ row.name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="methGenPaperDetail"
            label="组卷方式"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="paperTypeDetail"
            label="试卷分类"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="totalScore"
            label="总分"
            min-width="50"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="创建人"
            min-width="100"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="CreatedAt" label="创建时间" min-width="150"
            ><template #default="{ row }">
              {{ $filters.dateFilter(row.CreatedAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="200">
            <el-link type="primary" icon="PieChart" :underline="false">预览</el-link>
            <el-link type="primary" icon="ChatDotSquare" :underline="false">复习</el-link>
            <el-link type="primary" icon="View" :underline="false">创建考试</el-link>
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
    <el-dialog
      v-model="dialogVisible"
      :before-close="closeDialog"
      title="创建试卷"
      width="30%"
    >
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入试卷名称"></el-input>
        </el-form-item>
        <el-form-item label="试卷分类" prop="sort">
          <el-cascader
            v-model="form.sort"
            :options="paperSort"
            :props="{
              checkStrictly: true,
              emitPath: false,
              label: 'label',
              value: 'ID',
            }"
            clearable
          />
        </el-form-item>
        <el-form-item label="组卷方式" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="item in typeRadios"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddPaper(ruleFormRef)">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "List",
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { findExamPaperList, deleteExamPaper } from "@/api/paper.js";
import { findSysSortDictionary } from "@/api/sysSortDictionary.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
const router = useRouter();
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
const initSort = async () => {
  const { data } = await findSysSortDictionary({ ID: 28 });
  paperSort.value = data.sysDictionary.sysSortDictionaryDetails;
};
// 选项框数据
const option1 = ref([
  {
    value: "1",
    label: "正式考试",
  },
  {
    value: "2",
    label: "模拟考试",
  },
]);

// 表格数据
const tableData = ref([]);
// 页码
const page = ref(1);
// 每页大小
const pageSize = ref(10);
// 考试总数
const total = ref();
// 获取试卷信息
const getAllPaper = async () => {
  const { data } = await findExamPaperList({
    page: page.value,
    pageSize: pageSize.value,
  });
  tableData.value = data.list;
  total.value = data.total;
  ElMessage.success("数据获取成功");
};

const initTable = async () => {
  getAllPaper();
  initSort();
  initDataDictionary(typeRadios, 21);
};
const dialogVisible = ref(false);
// 添加试卷
const onAddPaper = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      router.push({
        name: "addPaper",
        query: {
          name: form.value.name,
          sort: form.value.sort,
          type: form.value.type
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 修改试卷信息
const editPaper = (tab) => {
  const id = tab.ID ? tab.ID : multipleSelection[0].ID;
  router.push({
    name: "upadte",
    // 传入选中项id
    params: {
      id: id,
    },
  });
};
let multipleSelection = reactive([]);
const isDisable = ref(true);
// 表格选项存储
const handleSelectionChange = (val) => {
  multipleSelection = val;
  if (val.length === 1) isDisable.value = false;
  else isDisable.value = true;
};
// 删除选中项
const deletePaper = (row) => {
  ElMessageBox.confirm("此操作将永久删除该考试, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteExamPaper({
        id: multipleSelection[0].ID,
      });
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--;
        }
        getAllPaper();
      }
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
  getAllExam();
};
const handleCurrentChange = (val) => {
  page.value = val; // 当前页
  getAllExam();
};
// 新建试卷
const form = ref({
  name: "",
  sort: NaN,
  type: NaN,
});
// 试卷分类
const paperSort = ref([]);
// 组卷方式
const typeRadios = ref([]);
// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入开始名称", trigger: "blur" }],
  sort: [{ required: true, message: "请选择试卷分类", trigger: "blur" }],
  type: [{ required: true, message: "请选择组卷方式", trigger: "blur" }],
});
const ruleFormRef = ref(null);
initTable();
</script>

<style lang="scss" scoped>
@import "@/style/element_visiable.scss";
.filter-container {
  margin-bottom: 10px;
  justify-content: center;
}
/* 样式穿透 */
:deep(.el-input),
:deep(.el-select) {
  width: 180px;
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

<!-- 考试管理 -->
<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="filter-container">
        <el-select
          v-model="examInput.examType"
          clearable
          placeholder="选择考试类型"
          @change="inputChange"
        >
          <el-option
            v-for="item in option_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="examInput.examAuthority"
          clearable
          placeholder="选择考试权限"
          @change="inputChange"
        >
          <el-option
            v-for="item in option_authority"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="examInput.beginTime"
          type="datetime"
          placeholder="考试开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss.000Z"
          @change="inputChange"
        >
        </el-date-picker>
        <el-date-picker
          v-model="examInput.finishTime"
          type="datetime"
          placeholder="考试结束时间"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="inputChange"
        >
        </el-date-picker>
        <el-input
          v-model="examInput.examName"
          placeholder="搜索考试名称"
          @input="inputChange"
        ></el-input>
        <!-- 操作按钮组 -->
        <div class="btns">
          <el-button type="primary" icon="Plus" @click="onAddExam">增加</el-button>
          <el-button
            type="warning"
            icon="EditPen"
            :disabled="isDisable"
            @click="onEditExam"
            >修改</el-button
          >
          <el-button type="danger" icon="Delete" :disabled="isDisable" @click="onDeleteExam"
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
          <el-table-column type="selection" min-width="55"> </el-table-column>
          <el-table-column
            prop="exam_name"
            label="考试名称"
            min-width="250"
            :show-overflow-tooltip="true"
          >
            <template #default="{ row }">
              <a href="javascript:;" class="d-link" @click="onEditExam(row)">
                {{ row.exam_name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="exam_type_id" label="考试类型" min-width="100">
            <template #default="{ row }">
              <template v-for="item in option_type">
                <span v-if="row.exam_type_id == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="exam_permission_id" label="考试权限" min-width="120">
            <template #default="{ row }">
              <template v-for="item in option_authority">
                <span v-if="row.exam_permission_id == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="考试开始时间"
            min-width="150"
            :show-overflow-tooltip="true"
          >
            <template #default="{ row }">
              {{ $filters.dateFilter(row.exam_time_start) }}
            </template>
          </el-table-column>
          <el-table-column
            label="考试结束时间"
            min-width="150"
            :show-overflow-tooltip="true"
            ><template #default="{ row }">
              {{ $filters.dateFilter(row.exam_time_end) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_score"
            label="考试总分"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="passing_grade"
            label="及格线"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="exam_price"
            label="售价"
            min-width="80"
          ></el-table-column>
          <el-table-column prop="state" label="状态" min-width="80"></el-table-column>
          <el-table-column prop="" label="操作" min-width="250">
            <el-link type="primary" icon="PieChart" :underline="false">统计分析</el-link>
            <el-link type="primary" icon="View" :underline="false">监考</el-link>
            <el-link type="primary" icon="ChatDotSquare" :underline="false">
              分享链接
            </el-link>
          </el-table-column>
        </el-table>
        <div class="gva-pagination">
          <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 30, 50, 100]"
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
  name: "Exam",
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPagingExam, deleteExam } from "@/api/exam.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
// 选项框数据
const option_type = ref([]);
const option_authority = ref([]);

// 接收输入框数据(类型、权限、开始时间、结束时间、考试名称)
const examInput = reactive({
  examType: "",
  examAuthority: "",
  beginTime: "",
  finishTime: "",
  examName: "",
});
// 表格数据
const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref();
// 获取考试信息
const getAllExam = async () => {
  const { data } = await getPagingExam({
    page: page.value,
    pageSize: pageSize.value,
    exam_name: examInput.examName,
    exam_type_id: examInput.examType,
    exam_permission_id: examInput.examAuthority,
    exam_time_end: examInput.finishTime,
    exam_time_start: examInput.beginTime,
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
  ElMessage.success("数据获取成功");
};
const initExam = () => {
  initDataDictionary(option_authority, 26);
  initDataDictionary(option_type, 27);
  getAllExam();
};
initExam();
let multipleSelection = reactive([]);
const isDisable = ref(true);
// 监听表格状态改变
const handleSelectionChange = (val) => {
  multipleSelection = val;
  if (val.length === 1) isDisable.value = false;
  else isDisable.value = true;
};
const router = useRouter();
// 添加考试
const onAddExam = () => {
  router.push({
    name: "addExam",
  });
};
// 修改考试信息
const onEditExam = (tab) => {
  // console.log(typeof tab.ID)
  const id = tab.ID ? tab.ID : multipleSelection[0].ID;
  router.push({
    name: "editExam",
    // 传入选中项id
    params: {
      id: id,
    },
  });
};
// 删除选中项
const onDeleteExam = () => {
  ElMessageBox.confirm("此操作将永久删除该考试, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteExam({
        exam_management_id: multipleSelection[0].ID,
      });
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--;
        }
        getAllExam();
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
// 监听输入框改变
const inputChange = (val) => {
  getAllExam();
};
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

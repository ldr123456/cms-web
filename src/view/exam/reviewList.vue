<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="inputs">
        <el-select
          v-model="searchInfo.paperState"
          clearable
          placeholder="交卷状态"
          @change="onInputChange"
        >
          <el-option
            v-for="item in paperState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchInfo.readState"
          clearable
          placeholder="阅卷状态"
          @change="onInputChange"
        >
          <el-option
            v-for="item in readState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="searchInfo.person"
          clearable
          placeholder="搜索人员"
          @change="onInputChange"
        ></el-input>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="exam_user_name" label="人员" min-width="50">
          <template #default="{ row }">
            <div @click="onEditPaper(row)">
              <a href="javascript:;" class="d-link">{{ row.exam_user_name }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="latest_end_time"
          label="考试时间"
          min-width="100"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            {{ $filters.dateFilter(row.latest_end_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="duration"
          label="考试时长(分钟)"
          min-width="80"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="user_subj_score"
          label="学员主观分"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="user_obj_score"
          label="学员客观分"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="user_total_score"
          label="学员总分"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="user_mu_qu_score"
          label="及格分"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="user_fill_qu_score"
          label="试卷总分"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="state_name"
          label="阅卷状态"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="marking_user_name"
          label="阅卷人"
          min-width="60"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" min-width="100" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <el-link
              type="primary"
              icon="Check"
              @click="onEditPaper(row)"
              :underline="false"
              >查看&批阅</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ReviewList",
};
</script>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getExamResultBaseListByID } from "@/api/review.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
const route = useRoute();
const router = useRouter();
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
// 初始化表格
const initTable = async () => {
  const { data } = await getExamResultBaseListByID({
    examResultID: route.params.id,
    page: page.value,
    pageSize: pageSize.value,
    state: searchInfo.value.readState,
    name: searchInfo.value.person
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
};
// 输入框数据
const searchInfo = ref({
  paperState: "",
  readState: "",
  person: "",
});
// 输入框选项
const paperState = ref([]);
const readState = ref([]);
// 初始化页面数据
const initList = () => {
  initTable();
  initDataDictionary(readState, 29);
};
initList();
// 监听输入框改变
const onInputChange = () => {
  initTable();
};
// 点击跳转试卷详情
const onEditPaper = (row) => {
  console.log(row);
  router.push({
    name: "reviewDetail",
    query: {
      exam_user_id: row.exam_user_id,
      exam_id: row.exam_id,
      frq: row.frq,
      id: route.params.id,
    },
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

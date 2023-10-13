<!-- 训练统计 -->
<template>
  <div>
    <el-card>
      <!-- 输入框 -->
      <div class="filter-container">
        <el-input
          v-model="form.title"
          placeholder="搜索题库名称"
          @input="inputChange"
        ></el-input>
        <el-date-picker
          v-model="form.trainTime"
          type="datetimerange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="inputChange"
        />
        <el-button type="primary" icon="Download">导出</el-button>
      </div>
      <!-- 表格 -->
      <div class="trainTable">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="title" label="题库名称" min-width="200">
          </el-table-column>
          <el-table-column prop="userCount" label="训练人数" min-width="50">
          </el-table-column>
          <el-table-column prop="answerCount" label="答题总数" min-width="50">
          </el-table-column>
          <el-table-column prop="rightCount" label="答对题数" min-width="50">
          </el-table-column>
          <el-table-column prop="rightRate" label="整体正确率%" min-width="50">
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
  name: "trainStatistics",
};
</script>

<script setup>
import { ref, reactive } from "vue";
import { getExamTrainStatisticsList } from "@/api/testManage.js";
// import { ElMessage, ElMessageBox } from "element-plus";

// 初始化表格
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const form = reactive({
  title: "",
  trainTime: "",
});
const tableData = ref([]);
const initTable = async () => {
  const { data } = await getExamTrainStatisticsList({
    page: page.value,
    pageSize: pageSize.value,
    title: form.title,
    trainStartTime: form.trainTime[0],
    trainEndTime: form.trainTime[1],
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
};
initTable();
// 输入框信息改变
const inputChange = () => {
  console.log(form.trainTime[0]);
  // initTable();
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

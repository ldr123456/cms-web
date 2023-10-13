<!-- 阅卷管理 -->
<template>
  <div>
    <el-card>
      <div class="gva-table-box">
        <el-select
          v-model="searchInfo.examType"
          clearable
          placeholder="选择考试类型"
          @change="onInputChange"
        >
          <el-option
            v-for="item in option_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="searchInfo.examName"
          placeholder="搜索考试名称名称"
          @input="onInputChange"
        />
        <el-table
          ref="examTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column align="left" label="考试名称" min-width="400" prop="exam_name">
            <template #default="{ row }">
              <div @click="onReadPerson(row.exam_result_id)">
                <a href="javascript:;" class="d-link">
                  {{ row.exam_name }}
                </a>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="考试类型"
            min-width="100"
            prop="exam_type_detail"
          ></el-table-column>
          <el-table-column align="left" label="考试时间" min-width="300">
            <template #default="{ row }">
              {{
                $filters.dateFilter(row.exam_time_start) +
                "~" +
                $filters.dateFilter(row.exam_time_end)
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="考试人数"
            min-width="100"
            prop="exam_user_number"
          ></el-table-column>
          <el-table-column
            align="left"
            label="待阅试卷"
            min-width="100"
            prop="unread_paper_number"
          ></el-table-column>
          <el-table-column align="left" label="操作" min-width="100" prop="email">
            <template #default="{ row }">
              <div @click="onReadPerson(row.exam_result_id)">
                <el-link type="primary" icon="ChatRound" :underline="false">
                  批阅试卷
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
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

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { reviewPaging } from "@/api/review.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
const router = useRouter();
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
// 搜索框
const searchInfo = ref({
  examType: "",
  examName: "",
});
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);
const initTable = async () => {
  const { data } = await reviewPaging({
    page: page.value,
    pageSize: pageSize.value,
    exam_name: searchInfo.value.examName,
    exam_type: searchInfo.value.examType,
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
};
const option_type = ref([]);
const initExam = async () => {
  console.log('initExam');
  initTable();
  initDataDictionary(option_type, 27);
};
initExam();
// 搜索框
const onInputChange = () => {
  console.log('onInputChange');
  initTable();
};
// 点击名称跳转
const onReadPerson = (exam_result_id) => {
  router.push({
    name: "reviewList",
    // 传入选中项id
    params: {
      id: exam_result_id,
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

.d-link {
  color: #1890ff;
  font-weight: 700;
}
.d-link:hover {
  color: #ff8000;
}
</style>

<template>
  <div>
    <el-steps :space="200" :active="active" simple style="margin-bottom: 20px">
      <el-step title="创建/选择试卷" icon="Checked" />
      <el-step title="考试配置" icon="Ticket" />
      <el-step title="发布考试" icon="CircleCheckFilled" />
    </el-steps>
    <!-- 创建选择试卷 -->
    <div v-if="active === 1">
      <h2>选择/创建试卷</h2>
      <el-card>
        <el-radio v-model="radio" :label="1">选择已有试卷创建考试</el-radio>
        <div v-if="radio === 1">
          <!-- 按钮搜索框 -->
          <div class="btns">
            <el-button type="warning" icon="EditPen" disabled @click="onEditExam">
              修改
            </el-button>
            <el-button type="danger" icon="Delete" disabled @click="deleteExam">
              删除
            </el-button>
            <el-cascader
              v-model="inputScreen.screenType"
              :options="paperSort"
              :props="{
                checkStrictly: true,
                emitPath: false,
                label: 'label',
                value: 'ID',
              }"
              clearable
              placeholder="请选择试卷分类"
              @change="inputChange"
            />
            <el-select
              v-model="inputScreen.paperMethod"
              clearable
              placeholder="请选择组卷方式"
              @change="inputChange"
            >
              <el-option
                v-for="item in typeRadios"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="inputScreen.screenName"
              placeholder="试卷名称"
              @input="inputChange"
            ></el-input>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="name" label="试卷名称" min-width="400">
              <template #default="{ row }">
                <div @click="onEditExam(row.ID)">
                  <a href="javascript:;" class="d-link">{{ row.name }}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="methGenPaperDetail"
              label="组卷方式"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="paperTypeDetail"
              label="试卷分类"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="totalScore"
              label="总分"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="userName"
              label="创建人"
              min-width="100"
            ></el-table-column>
            <el-table-column label="创建时间" min-width="200">
              <template #default="{ row }">
                {{ $filters.dateFilter(row.CreatedAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200">
              <template #default="{ row }">
                <el-button type="primary" icon="Check" @click="onSelectPaper(row.id)">
                  选定
                </el-button>
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
      <el-card>
        <el-radio v-model="radio" :label="2">新建试卷并创建考试</el-radio>
        <div v-if="radio === 2">
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
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onAddPaper()">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <!-- 考试配置 -->
    <div v-if="active === 2">
      <Paper
        :type="form.type"
        :name="form.name"
        :sort="form.sort"
        :active="active"
        @changeActive="changeActive"
      ></Paper>
    </div>
    <!-- 发布考试 -->
    <div v-if="active === 3">
      <EditExam :numb="numb" :skip="skip"></EditExam>
    </div>
  </div>
</template>

<script>
export default {
  name: "addExam",
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import EditExam from "@/components/edit/EditExam.vue";
import Paper from "@/components/edit/Paper.vue";
import { findSysSortDictionary } from "@/api/sysSortDictionary.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
import { findExamPaperList } from "@/api/paper";

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
// 试卷分类
const paperSort = ref([]);
// 组卷方式
const typeRadios = ref([]);
// 步骤条
const active = ref(1);
// 默认选择按钮
const radio = ref(1);
// 筛选
const inputScreen = reactive({
  screenType: "",
  paperMethod: "",
  screenName: "",
});
// 数据初始化
const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const initTable = async () => {
  const { data } = await findExamPaperList({
    page: page.value,
    pageSize: pageSize.value,
    type: inputScreen.screenType,
    method_generate_paper: inputScreen.paperMethod,
    name: inputScreen.screenName,
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.page_size;
  total.value = data.total;
};
const initAddExam = () => {
  initDataDictionary(typeRadios, 21);
  initSort();
  initTable();
};
initAddExam();
const inputChange = () => {
  initTable();
};
// 删除试卷
const deleteExam = () => {};

// 跳转修改试卷
const onEditExam = (ID) => {
  router.push({
    name: "upadte",
    // 传入选中项id
    params: {
      id: ID,
    },
  });
};
// 选定试卷
const onSelectPaper = (ID) => {
  // 步骤条
  active.value = 3;
  // 传入组件的数据
  numb.value = ID;
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
// 新建试卷
const form = ref({
  name: "",
  sort: "",
  type: "",
});
// 发布考试
const numb = ref();
const skip = ref("addExam");
// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入开始名称", trigger: "blur" }],
  sort: [{ required: true, message: "请选择试卷分类", trigger: "change" }],
  type: [{ required: true, message: "请选择组卷方式", trigger: "change" }],
});
const ruleFormRef = ref(null);
// 跳转添加试卷
const onAddPaper = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      active.value = 2;
    } else {
      return false;
    }
  });
  // router.push({
  //   name: "addPaper",
  //   // 传入选中项id
  //   params: {
  //     id: ID,
  //   },
  // })
};
// 跳转编辑页面
const changeActive = (val) => {
  active.value = val.active;
  numb.value = val.id;
};
</script>

<style lang="scss" scoped>
@import "@/style/element_visiable.scss";
/* 样式穿透 */
:deep(.btns .el-input) {
  width: 180px;
  height: 36px;
  line-height: 36px;
  margin-left: 10px;
}
// 链接
.d-link {
  color: #1890ff;
  font-weight: 700;
}
.d-link:hover {
  color: #ff8000;
}
.el-card {
  margin-bottom: 20px;
}
// 试卷信息
.exam_management div {
  padding: 10px;
}
.exam_authority {
  background-color: #f5f7fa;
  padding: 10px;
}
.authority {
  padding: 20px;
  background-color: #fdf6ec;
  color: #eebe77;
}
.auth_person div {
  margin: 10px 0;
}
.btns {
  margin: 10px 0;
}
.dialogInput {
  width: 180px;
  height: 36px;
  line-height: 36px;
  margin: 0 10px;
}
</style>

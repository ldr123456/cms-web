<!-- 更新题库 -->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <span class="title">基本信息</span>
        <el-card>
          <el-form ref="ruleFormRef" :model="formInput" :rules="rules" status-icon>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="题库名称" prop="qb_name">
                  <el-input
                    v-model="formInput.qb_name"
                    placeholder="请输入题库名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="题库分类">
                  <el-cascader
                    v-model="formInput.qb_type"
                    :options="questionBankSort"
                    :show-all-levelsp="false"
                    placeholder="请选择分类"
                    :props="{
                      checkStrictly: true,
                      emitPath: false,
                      label: 'label',
                      value: 'label',
                    }"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="题库描述">
                  <el-input
                    v-model="formInput.qb_desc"
                    :rows="2"
                    type="textarea"
                    placeholder="请输入题库描述"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作用范围" style="margin-bottom: 0">
                  <el-checkbox v-model="formInput.is_exam" label="用于考试" />
                  <el-checkbox v-model="formInput.is_train" label="用于训练" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formInput.is_train">
                <el-form-item label="题库售价" style="margin-bottom: 0">
                  <el-input-number
                    v-model="formInput.qb_price"
                    :precision="2"
                    :step="1"
                    :min="0"
                    size="large"
                  ></el-input-number>
                  <el-tooltip
                    effect="dark"
                    content="如果设置大于0，则需要学员付费后才能考试"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <span class="title" v-if="formInput.is_train">训练权限</span>
        <el-card v-if="formInput.is_train">
          <div>
            <el-radio-group v-model="formInput.train_open_type">
              <el-radio
                v-for="item in authoritySort"
                :label="item.value"
                :key="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <div style="padding-top: 20px">
              <div v-if="formInput.train_open_type == 1">
                <el-alert title="开放的，任何人都可以进行考试！" type="warning" />
              </div>
              <div v-if="formInput.train_open_type == 2">
                <el-input
                  v-model="formInput.sys_department_id"
                  placeholder="已选中"
                ></el-input>
                <el-cascader-panel
                  v-model="formInput.sys_department_id"
                  :options="departOptions"
                  :show-all-levels="false"
                  :props="{
                    multiple: true,
                    checkStrictly: false,
                    emitPath: false,
                    label: 'name',
                    value: 'ID',
                    disabled: 'disabled',
                  }"
                  :clearable="false"
                />
              </div>
              <div v-if="formInput.train_open_type == 3">
                <div style="margin-bottom: 10px">
                  <el-button type="primary" icon="Plus" @click="addPerson">
                    添加
                  </el-button>
                  <el-button
                    type="danger"
                    icon="Delete"
                    :disabled="isDisable"
                    @click="deletePerson"
                  >
                    删除
                  </el-button>
                  <el-input
                    placeholder="搜索ID/用户名/姓名/手机号"
                    style="width: 300px; margin-left: 10px"
                  ></el-input>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleAddChange"
                >
                  <el-table-column type="selection" min-width="50"> </el-table-column>
                  <el-table-column
                    prop="nickName"
                    label="用户ID"
                    min-width="200"
                  ></el-table-column>
                  <el-table-column
                    prop="nickName"
                    label="用户名"
                    min-width="200"
                  ></el-table-column>
                  <el-table-column
                    prop="real_user_name"
                    label="姓名"
                    min-width="200"
                  ></el-table-column>
                  <el-table-column
                    prop="phone"
                    label="手机号码"
                    min-width="200"
                  ></el-table-column>
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
              <div v-if="formInput.train_open_type == 4">
                <el-alert title="该模块不存在，如需使用请联系前端人员添加" type="error" />
              </div>
            </div>
          </div>
        </el-card>
        <div class="btns">
          <el-button type="primary" @click="addQuestionBank(ruleFormRef)">保存</el-button>
          <el-button type="info" @click="infoQuBank">返回</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <span class="title">章节管理</span>
        <el-button type="primary" style="float: right" @click="addChapt">添加</el-button>
        <el-card style="min-height: 600px">
          <el-table
            ref="chaptTable"
            :data="formInput.qb_chapter"
            :row-class-name="tableRowClassName"
            style="width: 100%"
          >
            <el-table-column prop="name" label="章节名称" min-width="200">
              <template #default="{ row }">
                <el-input v-model="row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="试题数量"
              min-width="80"
            ></el-table-column>
            <el-table-column label="操作" min-width="80">
              <template #default="{ row }">
                <el-button
                  type="danger"
                  icon="Delete"
                  @click="deleteChapt(row.index)"
                  circle
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="dialogFormVisible"
      :before-close="closeDialog"
      :selectable="disallowSeletion"
      title="选择用户"
      width="60%"
    >
      <div class="btns">
        <el-cascader
          placeholder="请选择"
          :options="departOptions"
          :props="{
            multiple: true,
            checkStrictly: false,
            emitPath: false,
            label: 'name',
            value: 'id',
            disabled: 'disabled',
          }"
          clearable
        />
        <el-input placeholder="用户名/姓名" class="dialogInput"></el-input>
        <el-button type="primary" @click="submitDialogData">选择{{ person }}项</el-button>
      </div>
      <el-table
        ref="dialogTable"
        :data="dialogData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="50"> </el-table-column>
        <el-table-column prop="nickName" label="用户名" min-width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="200"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="200"> </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="perPage"
          :page-size="perPageSize"
          :page-sizes="[5, 10, 30, 50, 100]"
          :total="perTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="perCurrentChange"
          @size-change="perSizeChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "updateBank",
};
</script>

<script setup>
import { ref, reactive } from "vue";
import { getUserList } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getDepartmentList } from "@/api/department.js";
import { findSysSortDictionary } from "@/api/sysSortDictionary.js";
import { findSysDataDictionaryDetail } from "@/api/sysDataDictionary.js";
import {
  getQuestionBankById,
  createQuestionBank,
  updateQuestionBank,
} from "@/api/questionBank.js";
const route = useRoute();
const router = useRouter();
const ruleFormRef = ref();
const formInput = ref({
  qb_name: "",
  qb_type: "",
  qb_desc: "",
  train_open_type_dict_text: "",
  train_open_type: 1,
  is_exam: true,
  is_train: true,
  qb_price: 0,
  sys_department_id: [],
  qb_chapter: [],
});
// 表单校验规则
const rules = reactive({
  qb_name: [{ required: true, message: "试题类型不能为空！", trigger: "change" }],
});
// 题库分类
const questionBankSort = ref([]);
const initSort = async () => {
  const { data } = await findSysSortDictionary({ ID: 27 });
  questionBankSort.value = data.sysDictionary.sysSortDictionaryDetails;
};
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({ sysDataDictionaryID: id });
  Data.value = data.reSysDataDictionaryDetail;
};
// 权限管理
const authoritySort = ref("");
const departOptions = ref([]);
const initQuBankInfo = async () => {
  initDataDictionary(authoritySort, 26);
  const { data } = await getDepartmentList({ page: 1, pageSize: 10 });
  departOptions.value = data.list;
  initTable();
  initDialog();
  initSort();
  if (route.params.id != 0) {
    const res = await getQuestionBankById({ id: route.params.id });
    formInput.value = res.data.ExamQuestionBank;
  }
};
initQuBankInfo();
const isDisable = ref(true);
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val; // 每页显示个数
  initTable();
};
const handleCurrentChange = (val) => {
  page.value = val; // 当前页
  initTable();
};
// 指定人员
const tableData = ref([]);
// 指定人员表格初始化
const page = ref(1);
const pageSize = ref(10);
const total = ref();
const initTable = async () => {
  // const { data } = await getPagingExamManagementUser({
  //   page: page.value,
  //   pageSize: pageSize.value,
  //   id: ruleForm.value.ID,
  // });
  // tableData.value = data.list;
  // page.value = data.page;
  // pageSize.value = data.pageSize;
  // total.value = data.total;
};

// 添加用户
const addPerson = async () => {
  dialogFormVisible.value = true;
  initDialog();
};
// 删除用户
const deletePerson = async () => {
  const deletePersonData = multipleSelection.value.map((item, index) => {
    return item.user_id;
  });
  const { data } = await deleteExamManagementUser({
    user_id: deletePersonData,
    exam_management_id: ruleForm.value.ID,
  });
  initTable();
};
// 章节管理
const addChapt = () => {
  formInput.value.qb_chapter.push({
    name: "新章节",
    number: "",
  });
};
const deleteChapt = (index) => {
  formInput.value.qb_chapter.splice(index, 1);
};
// 为表格数据添加索引
const tableRowClassName = ({ row, rowIndex }) => {
  row.index = rowIndex;
};
const createBank = async () => {
  if (route.params.id == 0) {
    // 添加题库
    const res = await createQuestionBank(formInput.value);
    if (res.code == 0) {
      ElMessage.success(res.msg);
    }
    ElMessageBox.confirm("请选择接下来的操作", {
      distinguishCancelAndClose: true,
      confirmButtonText: "继续添加题库",
      cancelButtonText: "返回题库列表",
    })
      .then(() => {
        formInput.value = {
          qb_name: "",
          qb_type: "",
          qb_desc: "",
          train_open_type_dict_text: "",
          train_open_type: 1,
          is_exam: true,
          is_train: true,
          qb_price: 0,
          sys_department_id: [],
          qb_chapter: [],
        };
      })
      .catch((action) => {
        if (action === "cancel") {
          router.push({
            name: "questionBankManage",
          });
        }
      });
  } else {
    // 更新题库
    authoritySort.value.forEach((item) => {
      if (item.value == formInput.value.train_open_type) {
        formInput.value.train_open_type_dict_text = item.label;
      }
    });
    const res = await updateQuestionBank(formInput.value);
    if (res.code == 0) {
      ElMessage.success(res.msg);
      router.push({
        name: "questionBankManage",
      });
    }
  }
};
// 保存题库
const addQuestionBank = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      createBank();
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 返回
const infoQuBank = () => {
  router.push({
    name: "questionBankManage",
  });
};
// 弹窗数据初始化
const perPage = ref(1);
const perPageSize = ref(10);
const perTotal = ref();
const initDialog = async () => {
  const { data } = await getUserList({
    page: perPage.value,
    pageSize: perPageSize.value,
  });
  perPage.value = data.page;
  perPageSize.value = data.pageSize;
  perTotal.value = data.total;
  dialogData.value = data.list;
};
// 点击添加人员
const addTable = async () => {
  const table = await CreateExamManagementUser({
    user_id: subDialogData,
    page: page.value,
    pageSize: pageSize.value,
    exam_management_id: ruleForm.value.ID,
  });
  tableData.value = table.data.list;
};
// 弹窗显隐
const dialogFormVisible = ref(false);
const dialogForm = ref({
  skip: "",
  authority: "",
  name: "",
});
// 弹窗表格
const dialogData = ref([]);
let subDialogData = [];
// 监听人员表格状态改变
const multipleDialog = reactive([]);
const disSeletion = ref([]);
const person = ref(0);
const handleSelectionChange = (val) => {
  multipleDialog.value = val;
  person.value = val.length;
  subDialogData = val.map((item, index) => {
    return item.ID;
  });
};
// 设置禁选项
const disallowSeletion = (row, index) => {
  let choose = true;
  disSeletion.value.map((item) => {
    if (item == row.ID) choose = false;
  });
  return choose;
};
// 提交弹窗表格信息
const submitDialogData = () => {
  addTable();
  closeDialog();
};

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false;
  dialogData.value = [];
};
// 分页
const perSizeChange = (val) => {
  perPageSize.value = val; // 每页显示个数
  initDialog();
};
const perCurrentChange = (val) => {
  perPage.value = val; // 当前页
  initDialog();
};
</script>

<style lang="scss" scoped>
@import "@/style/element_visiable.scss";
span.title {
  font-size: 20px;
  font-weight: bold;
}
.el-card {
  margin: 10px 0;
}
.dialogInput {
  width: 180px;
  height: 36px;
  line-height: 36px;
  margin: 0 10px;
}
</style>

<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="18">
        <h3>考试设置</h3>
        <el-card style="margin-bottom: 20px">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="考试名称" prop="exam_name">
                  <el-input
                    v-model="ruleForm.exam_name"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考试类型" prop="exam_type_id">
                  <el-select
                    v-model="ruleForm.exam_type_id"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in option_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考试售价" prop="exam_price">
                  <el-input-number
                    v-model="ruleForm.exam_price"
                    :precision="2"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
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
              <el-col :span="12">
                <el-form-item label="及格分" prop="passing_grade">
                  <el-input-number
                    v-model="ruleForm.passing_grade"
                    :step="1"
                    :min="0"
                    :max="examPaper.totalScore"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考试时长" prop="exam_duration">
                  <el-input-number
                    v-model="ruleForm.exam_duration"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="单位：分钟"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限考次数" prop="number_of_exams">
                  <el-input-number
                    v-model="ruleForm.number_of_exams"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="限制每个考生有几次考试机会，0为不限制"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考试时间" prop="date">
                  <el-date-picker
                    v-model="ruleForm.date"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="积分数量" prop="number_of_points">
                  <el-input-number
                    v-model="ruleForm.number_of_points"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="通过考试后获取积分数量，0为无"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="最低交卷时长"
                  prop="minimum_submission_time"
                >
                  <el-input-number
                    v-model="ruleForm.minimum_submission_time"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="最低答题分钟数，未达到不允许交卷，0为不开启"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="允许迟到时长"
                  prop="time_allowed_to_be_late"
                >
                  <el-input-number
                    v-model="ruleForm.time_allowed_to_be_late"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="允许迟到的分钟数，注意：某段时间都可以考试的长期考试请设置为0"
                    placement="top"
                  >
                    <el-icon :size="20" color="#409EFC" style="margin: 0 5px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="考前注意事项" prop="notes_on_exam">
                  <el-input
                    v-model="ruleForm.notes_on_exam"
                    maxlength="2000"
                    placeholder="请输入"
                    show-word-limit
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="考试结果显示" prop="exam_result_display">
                  <el-radio-group v-model="ruleForm.exam_result_display">
                    <el-radio :label="1">仅显示感谢文字</el-radio>
                    <el-radio :label="2">显示感谢文字+成绩</el-radio>
                    <el-radio :label="3">显示试卷明细</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="考后感谢文字"
                  prop="thank_you_after_the_exam"
                >
                  <el-input
                    v-model="ruleForm.thank_you_after_the_exam"
                    maxlength="2000"
                    placeholder="请输入"
                    show-word-limit
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="exam_authority">
                <el-form-item label="考试权限" prop="exam_authority">
                  <el-radio-group v-model="ruleForm.exam_permission_id">
                    <el-radio
                      v-for="item in option_authority"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                      >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <div>
                  <div v-if="ruleForm.exam_permission_id === 1">
                    <el-alert
                      title="开放的，任何人都可以进行考试！"
                      type="warning"
                    />
                  </div>
                  <div v-if="ruleForm.exam_permission_id === 2">
                    <el-cascader-panel
                      v-model="ruleForm.exam_department_id"
                      :options="departOptions"
                      :show-all-levels="false"
                      :props="{
                        multiple: true,
                        checkStrictly: false,
                        label: 'departName',
                        value: 'departmentId',
                        disabled: 'disabled',
                        emitPath: false,
                      }"
                      :clearable="false"
                    />
                  </div>
                  <div
                    v-if="ruleForm.exam_permission_id === 3"
                    class="auth_person"
                  >
                    <div>
                      <el-input
                        placeholder="搜索ID/用户名/姓名/手机号"
                      ></el-input>
                    </div>
                    <div class="auth_btns">
                      <el-button type="primary" icon="Plus" @click="onAddPerson"
                        >添加</el-button
                      >
                      <el-button
                        type="danger"
                        icon="Delete"
                        :disabled="isDisable"
                        @click="deletePerson"
                        >删除</el-button
                      >
                    </div>
                    <div>
                      <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleAddChange"
                      >
                        <el-table-column type="selection" min-width="50">
                        </el-table-column>
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
                          label="手机号"
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
                  </div>
                  <div v-if="ruleForm.exam_permission_id === 4">
                    <el-input
                      v-model="ruleForm.password_password"
                      placeholder="输入考试密码"
                    ></el-input>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-button type="primary" @click="onFormChange">保存</el-button>
      </el-col>
      <el-col :span="6">
        <h3>试卷信息</h3>
        <el-card class="exam_management">
          <div>
            试卷标题：<el-link type="primary">{{ examPaper.name }}</el-link>
          </div>
          <div>试卷总分：{{ examPaper.totalScore }}</div>
          <div>试题数量：{{ examPaper.questionsNumber }}</div>
          <div>出卷人员：{{ examPaper.userName }}</div>
          <div>创建时间：{{ $filters.dateFilter(examPaper.CreatedAt) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="dialogFormVisible"
      :before-close="closeDialog"
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
            label: 'departName',
            value: 'departmentId',
            disabled: 'disabled',
            emitPath: false,
          }"
          class="dialogInput"
          clearable
        />
        <el-input placeholder="用户名/姓名" class="dialogInput"></el-input>
        <el-button type="primary" @click="submitDialogData"
          >选择{{ person }}项</el-button
        >
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
        <el-table-column
          prop="userName"
          label="用户名"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="nickName"
          label="姓名"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="200"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="200">
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="perPage"
          :page-size="perPageSize"
          :page-sizes="[5, 10, 30, 50, 100]"
          :total="perTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  updateExam,
  createExam,
  getExamAndPaper,
  CreateExamManagementUser,
  deleteExamManagementUser,
  getPagingExamManagementUser,
} from '@/api/exam'
import { ElMessage } from 'element-plus'
import { getDepartmentList } from '@/api/department'
import { getUserList } from '@/api/user'
import { getExamPaperByID } from '@/api/paper'
import { ref, reactive } from 'vue'
import { findSysDataDictionaryDetail } from '@/api/sysDataDictionary.js'

const props = defineProps({
  numb: Number,
  skip: String,
})
const router = useRouter()
const examId = props.numb
const ruleFormRef = ref(null)
// 初始化相关
// 递归初始化用户角色级联选择器数据
const setAuthorityOptions = (DepartData, DepartOption) => {
  DepartData &&
    DepartData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          departmentId: item.ID,
          departName: item.name,
          children: [],
        }
        setAuthorityOptions(item.children, option.children)
        DepartOption.push(option)
      } else {
        const option = {
          departmentId: item.ID,
          departName: item.name,
        }
        DepartOption.push(option)
      }
    })
}
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({
    sysDataDictionaryID: id,
  })
  Data.value = data.reSysDataDictionaryDetail
}
// 表单域下组件默认大小'large' | 'default' | 'small'
const formSize = ref('default')
const ruleForm = ref({
  exam_name: '',
  exam_type_id: '',
  exam_price: 0,
  passing_grade: 0,
  exam_duration: 0,
  number_of_points: 0,
  minimum_submission_time: 0,
  time_allowed_to_be_late: 0,
  notes_on_exam: '',
  thank_you_after_the_exam: '',
  exam_time_start: '',
  exam_time_end: '',
  limit_exam_time: '',
  number_of_exams: 0,
  exam_result_display: 1,
  exam_paper_id: '',
  exam_permission_id: 1,
  permission_department_arr: [],
  permission_user_arr: [],
})
const examPaper = ref({})
const option_type = ref([])
const option_authority = ref([])
// 初始化试卷数据
const initCourse = async () => {
  initDataDictionary(option_authority, 26)
  initDataDictionary(option_type, 27)
  // 部门权限
  const res = await getDepartmentList({ page: 1, pageSize: 10 })
  setOptions(res.data.list)
  if (props.skip === 'exam') {
    // 直接修改考试信息
    const { data } = await getExamAndPaper({
      exam_id: examId,
    })
    ruleForm.value = data
    ruleForm.value.date = [data.exam_time_start, data.exam_time_end]
    examPaper.value = data.exam_paper
    // 指定人员表格
    subDialogData = ruleForm.value.user_id.map(Number)
    initTable()
  } else if (props.skip === 'addExam') {
    // 添加考试的第三个子组件
    const { data } = await getExamPaperByID({
      id: examId,
    })
    // ruleForm.value = data;
    ruleForm.value.date = [data.exam_time_start, data.exam_time_end]
    examPaper.value = data
  }
}
initCourse()

// 表单校验规则
const rules = reactive({
  exam_name: [{ required: true, message: '请输入考试名称', trigger: 'change' }],
  exam_type_id: [
    { required: true, message: '请输入考试类型', trigger: 'change' },
  ],
  passing_grade: [
    { required: true, message: '请输入考试及格分', trigger: 'change' },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入一个非零正整数',
      trigger: 'change',
    },
  ],
  exam_duration: [
    { required: true, message: '请输入考试时长', trigger: 'change' },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入一个非零正整数',
      trigger: 'change',
    },
  ],
  number_of_exams: [
    { required: true, message: '请输入限考次数', trigger: 'change' },
  ],
  date: [
    {
      type: 'array',
      required: true,
      message: '请选择日期',
      trigger: 'change',
      0: {type: 'array',message: '请选择日期1',trigger: 'change',},
      1: {type: 'array',message: '请选择日期2',trigger: 'change',},
    },
  ],
  notes_on_exam: [
    { required: true, message: '请输入注意事项', trigger: 'change' },
  ],
  thank_you_after_the_exam: [
    { required: true, message: '请输入注意事项', trigger: 'change' },
  ],
})

// 存储所有的部门权限(部门开放)
const departmentList = ref({})
// 用户角色级联选择器 部门权限数据
const departOptions = ref([])
const setOptions = (departData) => {
  // 部门数据赋值为空
  departOptions.value = []
  // 渲染部门数组
  setAuthorityOptions(departData, departOptions.value)
}

// 指定人员
const tableData = ref([])
// 监听人员表格状态改变
const isDisable = ref(true)
const multipleSelection = ref([])
const handleAddChange = (val) => {
  multipleSelection.value = val
  // 控制删除按钮是否禁用
  if (val.length > 0) isDisable.value = false
  else isDisable.value = true
}
// 添加用户
const onAddPerson = async () => {
  dialogFormVisible.value = true
  initDialog()
}
// 删除用户
const deletePerson = async () => {
  const deletePersonData = multipleSelection.value.map((item, index) => {
    return item.user_id
  })
  const { data } = await deleteExamManagementUser({
    user_id: deletePersonData,
    exam_management_id: ruleForm.value.ID,
  })
  initTable()
}
// 指定人员表格初始化
const page = ref(1)
const pageSize = ref(10)
const total = ref()
const initTable = async () => {
  const { data } = await getPagingExamManagementUser({
    page: page.value,
    pageSize: pageSize.value,
    id: ruleForm.value.ID,
  })
  tableData.value = data.list
  page.value = data.page
  pageSize.value = data.pageSize
  total.value = data.total
}
// 弹窗数据初始化
const perPage = ref(1)
const perPageSize = ref(10)
const perTotal = ref()
const initDialog = async () => {
  const { data } = await getUserList({
    page: perPage.value,
    pageSize: perPageSize.value,
  })
  perPage.value = data.page
  perPageSize.value = data.pageSize
  perTotal.value = data.total
  data.list.map((item, index) => {
    dialogData.value.push({
      ID: item.ID,
      userName: item.userName,
      nickName: item.nickName,
      phone: item.phone,
      email: item.email,
    })
  })
}
// 点击添加人员
const addTable = async () => {
  const table = await CreateExamManagementUser({
    user_id: subDialogData,
    page: page.value,
    pageSize: pageSize.value,
    exam_management_id: ruleForm.value.ID,
  })
  tableData.value = table.data.list
}
// 提交表单
const onFormChange = () => {
  if (!ruleFormRef) return
  if(ruleForm.value.exam_permission_id == 2 && !ruleForm.value.exam_department_id){
    ElMessage.error('请选择部门')
    return
  }
  const data = ruleForm.value
  data.exam_time_start = ruleForm.value.date[0]
  data.exam_time_end = ruleForm.value.date[1]
  data.exam_paper_id = examId
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log(props.skip)
      if (props.skip == 'exam') {
        const res = await updateExam(data)
        if (res.code === 0) {
          ElMessage.success(res.msg)
          router.push({
            name: 'exam',
          });
        }
      } else if (props.skip == 'addExam') {
        const res = await createExam(data)
        if (res.code === 0) {
          ElMessage.success(res.msg)
          router.push({
            name: 'exam',
          });
        }
      }
    } else {
      return false
    }
  })
}

// 弹窗相关
// 弹窗显隐
const dialogFormVisible = ref(false)
const dialogForm = ref({
  skip: '',
  authority: '',
  name: '',
})
// 弹窗表格
const dialogData = ref([])
let subDialogData = []
// 监听人员表格状态改变
const multipleDialog = reactive([])
const person = ref(0)
const handleSelectionChange = (val) => {
  multipleDialog.value = val
  person.value = val.length
  subDialogData = val.map((item, index) => {
    return item.ID
  })
}
// 提交弹窗表格信息
const submitDialogData = () => {
  addTable()
  closeDialog()
}

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  dialogData.value = []
}
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val // 每页显示个数
  initTable()
}
const handleCurrentChange = (val) => {
  page.value = val // 当前页
  initTable()
}
</script>

<style lang="scss" scoped>
.exam_management div {
  padding: 10px;
}
.exam_authority {
  background-color: #f5f7fa;
  padding: 10px;
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

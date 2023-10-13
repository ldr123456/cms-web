<template>
  <div style="min-height: 60vh">
    <div style="display: flex">
      <div class="all-box-left">
        <el-card class="left-box">
          <div class="group-card">
            <div class="card-manage">
              <div>
                <template v-for="item in paperComMode" :key="item.value">
                  <span v-if="item.value == form.type"
                    >组卷方式：{{ item.label }}</span
                  >
                </template>
              </div>
              <div>
                试题总数：
                <span class="num_blue">{{ questionsNumber }}</span>
              </div>
              <div>
                试卷总分：
                <span class="num_blue">{{ totalScore }}</span>
              </div>
            </div>
            <el-button
              type="primary"
              @click="savePaper"
              style="width: 100%; margin-top: 20px"
            >
              保存试卷
            </el-button>
          </div>
          <template v-for="(items, index) in questionBankList" :key="index">
            <div v-if="items.questions.length" class="question-box">
              <span class="num_blue" @click="handleScroll(index)">{{
                items.Name
              }}</span>
              <el-divider />
              <div>
                共
                <i class="num_blue">{{ items.questions.length }}</i>
                题，共
                <i class="num_blue">{{
                  questionBankScore[items.questions[0].question.quType]
                }}</i>
                分
                <!-- <el-button type="primary" text @click="deleteQuestion">
                  <el-icon><Delete /></el-icon>删除
                </el-button> -->
              </div>
            </div>
          </template>
        </el-card>
      </div>
      <div class="all-box-right">
        <div class="tool-box">
          <el-row :gutter="12">
            <el-col :span="10">
              <el-form :model="form" label-width="120px">
                <el-form-item label="试卷名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="试卷分类">
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
              </el-form>
            </el-col>
            <el-col :span="10"></el-col>
            <el-col :span="4">
              <el-dropdown type="primary" @command="handleCommand">
                <el-button type="primary">
                  添加新的大题<el-icon class="el-icon--right"
                    ><arrow-down
                  /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in questionType"
                      :key="item.ID"
                      :label="item.label"
                      :command="item.value"
                      >{{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
        <div>
          <h3>题目列表</h3>
          <template v-for="(items, indexs) in questionBankList" :key="indexs">
            <el-card
              v-if="items.questions[0]"
              class="content-card"
              :id="indexs"
            >
              <template #header>
                <div class="card-header">
                  <div>
                    <el-input
                      v-model="items.Name"
                      disabled
                      style="width: 200px"
                    ></el-input>
                    <!-- <el-cascader
                      v-model="items[0].quType"
                      :options="questionType"
                      :props="{ checkStrictly: true, emitPath: false }"
                      disabled
                    /> -->
                    <el-button
                      @click="handleCommand(items.questions[0].question.quType)"
                    >
                      <el-icon><Plus /></el-icon>添加题目
                    </el-button>
                  </div>
                </div>
              </template>
              <div v-for="(item, indexs) in items.questions" :key="indexs">
                <div class="list-box">
                  <div class="list-qu">
                    <div class="qu-box">
                      <div class="qu-item">
                        <div class="num">{{ indexs + 1 }}</div>
                        <div class="content">
                          <span>{{ item.question.content }}</span>
                        </div>
                      </div>
                      <div
                        class="qu-answer"
                        v-if="
                          item.question.quType != 5 || item.question.quType != 6
                        "
                      >
                        <div
                          class="item"
                          v-for="i in item.question.answerList"
                          :key="i.index"
                        >
                          <div class="tag">{{ i.tag }}</div>
                          <div class="content">{{ i.content }}</div>
                          <div class="right" v-if="i.is_right">
                            <el-icon color="#1AAC1A">
                              <SuccessFilled /> </el-icon
                            >答案
                          </div>
                        </div>
                      </div>
                      <div class="as-box">
                        <div>
                          <div>大题解析：</div>
                          <div>
                            {{ item.question.analysis }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 组合题专用 -->
                    <div style="padding: 20px" v-if="item.question.quType == 6">
                      <div
                        class="sub-box"
                        v-for="(i, index) in item.question.subQuestionList"
                        :key="index"
                      >
                        <div style="flex-grow: 1">
                          <div class="qu-box">
                            <div class="qu-item">
                              <div class="num">{{ index + 1 }}</div>
                              <div class="content">
                                <span>{{ i.content }}</span>
                              </div>
                            </div>
                            <div class="qu-answer" v-if="i.quType != 5">
                              <div
                                class="item"
                                v-for="tag in i.answerList"
                                :key="tag.ID"
                              >
                                <div class="tag">{{ tag.tag }}</div>
                                <div class="content">{{ tag.content }}</div>
                                <div class="right" v-if="tag.is_right">
                                  <el-icon color="#1AAC1A">
                                    <SuccessFilled /> </el-icon
                                  >答案
                                </div>
                              </div>
                            </div>
                            <div class="as-box">
                              <div>
                                <div>大题解析：</div>
                                <div>
                                  {{ i.analysis }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="sub-box-score">
                          <div>
                            本题<el-input-number
                              class="topic_score"
                              v-model="i.score"
                              @change="scoreChange(item, index)"
                              :controls="false"
                            />分
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 控制每题的分数 -->
                  <div class="list-opt">
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="deleteQuestion(items, indexs)"
                      circle
                    />
                    <el-button icon="Top" @click="unfinish" circle />
                    <el-button icon="Bottom" @click="unfinish" circle />
                    <div class="opt-box" v-if="item.question.quType != 6">
                      <div>
                        本题<el-input-number
                          class="topic_score"
                          v-model="item.score"
                          @change="scoreChange(item, indexs)"
                          :controls="false"
                        />分
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :before-close="closeDialog"
      title="选择试题"
      width="60%"
    >
      <div v-if="form.type == '1'">
        <div>抽题组卷</div>
      </div>
      <div v-if="form.type == '2'">
        <div class="btns">
          <el-select
            v-model="selectTable.quType"
            placeholder="请选择"
            clearable
            disabled
            @change="inputChange"
          >
            <el-option
              v-for="item in questionType"
              :key="item.ID"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}
            </el-option>
          </el-select>
          <el-select
            v-model="selectTable.questionBankID"
            placeholder="选择或搜索题库"
            clearable
            @change="inputChange"
          >
            <el-option
              v-for="item in allExamQuestionBank"
              :key="item.ID"
              :label="item.qb_name"
              :value="item.ID"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="selectTable.content"
            placeholder="试题内容"
            clearable
            @input="inputChange"
          ></el-input>
          <el-button type="primary" @click="submitDialogData">
            确认{{ person }}项
          </el-button>
        </div>
        <el-table
          ref="dialogTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            min-width="50"
            :selectable="disallowSeletion"
          >
          </el-table-column>
          <el-table-column label="试题类型" min-width="50" prop="quType">
            <template #default="{ row }">
              <template v-for="item in questionType">
                <span v-if="row.quType == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="试题内容"
            min-width="200"
          ></el-table-column>
          <el-table-column
            prop="questionBankID"
            label="所属题库"
            min-width="100"
          >
            <template #default="{ row }">
              <template v-for="item in allExamQuestionBank">
                <span v-if="row.questionBankID == item.ID" :key="item.ID">
                  {{ item.qb_name }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="级别" min-width="50">
            <template #default="{ row }">
              <template v-for="item in questionLevel">
                <span v-if="row.level == item.value" :key="item.value">
                  {{ item.label }}
                </span>
              </template>
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
      <div v-if="form.type == '3'"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import {
  createExamPaper,
  getExamPaperByID,
  updateExamPaper,
} from '@/api/paper.js'
import { findSysSortDictionary } from '@/api/sysSortDictionary.js'
import { findSysDataDictionaryDetail } from '@/api/sysDataDictionary.js'
import { findExamQuestion, getExamQuestionList } from '@/api/testManage.js'
import { getAllExamQuestionBank } from '@/api/questionBank.js'
const router = useRouter() // 跳转链接
// 接收的数据
const props = defineProps({
  name: String,
  type: Number,
  sort: Number,
  active: Number,
  ID: Number,
})
const emit = defineEmits(['changeActive'])
// 初始化数据字典
const initDataDictionary = async (Data, id) => {
  const { data } = await findSysDataDictionaryDetail({
    sysDataDictionaryID: id,
  })
  Data.value = data.reSysDataDictionaryDetail
}
const initSort = async () => {
  const { data } = await findSysSortDictionary({ ID: 28 })
  paperSort.value = data.sysDictionary.sysSortDictionaryDetails
}
// 获取题库信息
const initQuestionBankList = async () => {
  const { data } = await getAllExamQuestionBank({})
  allExamQuestionBank.value = data.list
}
// 获取试题信息
const initQuestionList = async () => {
  const { data } = await getExamQuestionList({
    page: page.value,
    pageSize: pageSize.value,
    questionBankID: selectTable.value.questionBankID,
    quType: selectTable.value.quType,
    content: selectTable.value.content,
  })
  tableData.value = data.list
  page.value = data.page
  pageSize.value = data.pageSize
  total.value = data.total
}
// 获取单个试题详细信息
const examQuestion = async (id) => {
  const { data } = await findExamQuestion({
    ID: id,
  })
  if (data.resExamQuestion.subQuestionList) {
    data.resExamQuestion.subQuestionList.forEach((item) => {
      Object.assign(item, { score: 0 })
    })
  }
  Object.assign(data.resExamQuestion, { score: 0 })
  switch (data.resExamQuestion.quType) {
    case 1:
      questionBankList.singleQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.singleQuestionIds.push(data.resExamQuestion.ID)
      break
    case 2:
      questionBankList.multipleQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.multipleQuestionIds.push(data.resExamQuestion.ID)
      break
    case 3:
      questionBankList.judgeQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.judgeQuestionIds.push(data.resExamQuestion.ID)
      break
    case 4:
      questionBankList.fillQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.fillQuestionIds.push(data.resExamQuestion.ID)
      break
    case 5:
      questionBankList.shortAnswerQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.shortAnswerQuestionIds.push(
        data.resExamQuestion.ID,
      )
      break
    case 6:
      questionBankList.combinationQuestions.questions.push({
        question: data.resExamQuestion,
        score: 0,
      })
      questionBankIdList.value.combinationQuestionIds.push(
        data.resExamQuestion.ID,
      )
      break
  }
}
// 获取试卷详细信息
const getPaperDetail = async () => {
  const { data } = await getExamPaperByID({ id: props.ID })
  form.value.name = data.name
  form.value.sort = data.paperType
  form.value.type = data.methGenPaper
  questionBankList.singleQuestions = data.SingleQuestionSection
  questionBankList.multipleQuestions = data.MultipleQuestionSection
  questionBankList.judgeQuestions = data.JudgeQuestionSection
  questionBankList.fillQuestions = data.FillQuestionSection
  questionBankList.shortAnswerQuestions = data.ShortAnswerQuestionSection
  questionBankList.combinationQuestions = data.CombinationQuestionSection
  for (const key in questionBankList) {
    questionBankList[key].questions.forEach((item, index) => {
      questionsNumber.value++
      scoreChange(item, index)
    })
  }
}
// 题型
const questionType = ref([])
// 试卷分类
const paperSort = ref([])
// 组卷方式
const paperComMode = ref([])
// 试题难度等级
const questionLevel = ref([])
// 权限类型
const authoritySort = ref([])
// 题库信息
const allExamQuestionBank = ref([])
const initPaper = async () => {
  initDataDictionary(questionType, 9)
  initDataDictionary(paperComMode, 21)
  initDataDictionary(questionLevel, 10)
  initDataDictionary(authoritySort, 26)
  initSort()
  if (props.ID) {
    getPaperDetail()
  }
}
initPaper()
// 点击滑动
const handleScroll = (id) => {
  var element = document.getElementById(id)
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  }) // 参数 false 代表 Bottom
}
// 试卷信息
const questionsNumber = ref(0)
const totalScore = ref(0)
const form = ref({
  name: props.name,
  sort: Number(props.sort),
  type: Number(props.type),
})
// 定义试题信息
const questionBankList = reactive({
  singleQuestions: { questions: [], Name: '单选题' },
  multipleQuestions: { questions: [], Name: '多选题' },
  judgeQuestions: { questions: [], Name: '判断题' },
  fillQuestions: { questions: [], Name: '填空题' },
  shortAnswerQuestions: { questions: [], Name: '简答题' },
  combinationQuestions: { questions: [], Name: '组合题' },
})
// 记录试卷所有信息
const questionBankIdList = ref({
  name: form.value.name,
  paperType: form.value.sort,
  methGenPaper: form.value.type,
  singleQuestionIds: [],
  singleQuestionEachScores: [],
  multipleQuestionIds: [],
  multipleQuestionEachScores: [],
  judgeQuestionIds: [],
  judgeQuestionEachScores: [],
  fillQuestionIds: [],
  fillQuestionEachScores: [],
  shortAnswerQuestionIds: [],
  shortAnswerQuestionEachScores: [],
  combinationQuestionIds: [],
  combinationQuestionEachScores: [],
})
const questionBankScore = ref([0, 0, 0, 0, 0, 0, 0])
// 准备需要传递的数据
const scoreChange = (item, index) => {
  computeScore()
  switch (item.question.quType) {
    case 1:
      questionBankIdList.value.singleQuestionIds[index] = item.question.ID
      questionBankIdList.value.singleQuestionEachScores[index] = item.score
      break
    case 2:
      questionBankIdList.value.multipleQuestionIds[index] = item.question.ID
      questionBankIdList.value.multipleQuestionEachScores[index] = item.score
      break
    case 3:
      questionBankIdList.value.judgeQuestionIds[index] = item.question.ID
      questionBankIdList.value.judgeQuestionEachScores[index] = item.score
      break
    case 4:
      questionBankIdList.value.fillQuestionIds[index] = item.question.ID
      questionBankIdList.value.fillQuestionEachScores[index] = item.score
      break
    case 5:
      questionBankIdList.value.shortAnswerQuestionIds[index] = item.question.ID
      questionBankIdList.value.shortAnswerQuestionEachScores[index] = item.score
      break
    case 6:
      questionBankIdList.value.combinationQuestionIds[index] = item.question.ID
      questionBankIdList.value.combinationQuestionEachScores[index] = item.score
      break
  }
}
// 计算试题分值
const computeScore = () => {
  totalScore.value = 0
  questionBankScore.value = [0, 0, 0, 0, 0, 0, 0]
  for (let i in questionBankList) {
    questionBankList[i].questions.forEach((item) => {
      if (item.question.quType == 6) {
        // 判断是否为组合题
        item.score = 0
        item.question.subQuestionList.forEach((i) => {
          item.score += i.score
        })
      }
      questionBankScore.value[item.question.quType] += item.score
    })
  }
  questionBankScore.value.forEach((item) => {
    totalScore.value += item
  })
}
// 删除试题
const deleteQuestion = (items, index) => {
  const selectData = items.questions[index]
  // 移除对应的渲染数据
  items.questions.splice(index, 1)
  // 移除对应的传递数据
  switch (selectData.question.quType) {
    case 1:
      questionBankIdList.value.singleQuestionIds.splice(index, 1)
      questionBankIdList.value.singleQuestionEachScores.splice(index, 1)
      break
    case 2:
      questionBankIdList.value.multipleQuestionIds.splice(index, 1)
      questionBankIdList.value.multipleQuestionEachScores.splice(index, 1)
      break
    case 3:
      questionBankIdList.value.judgeQuestionIds.splice(index, 1)
      questionBankIdList.value.judgeQuestionEachScores.splice(index, 1)
      break
    case 4:
      questionBankIdList.value.fillQuestionIds.splice(index, 1)
      questionBankIdList.value.fillQuestionEachScores.splice(index, 1)
      break
    case 5:
      questionBankIdList.value.shortAnswerQuestionIds.splice(index, 1)
      questionBankIdList.value.shortAnswerQuestionEachScores.splice(index, 1)
      break
    case 6:
      questionBankIdList.value.combinationQuestionIds.splice(index, 1)
      questionBankIdList.value.combinationQuestionEachScores.splice(index, 1)
      break
  }
  // 总题数
  questionsNumber.value--
  // 计算试题分数
  computeScore()
  // console.log(items[index]);
  // 表格禁选
  disSeletion.value.forEach((item, i) => {
    if (item == selectData.question.ID) {
      // console.log(items[index].ID);
      disSeletion.value.splice(i, 1)
    }
  })
  ElMessage({
    message: '删除试题成功',
    type: 'success',
  })
}
// 保存试卷
const savePaper = async () => {
  questionBankIdList.value.name = form.value.name
  questionBankIdList.value.paperType = form.value.sort
  questionBankIdList.value.methGenPaper = form.value.type
  if (props.ID) {
    questionBankIdList.value.paper_id = Number(props.ID)
    // 修改试卷
    const res = await updateExamPaper(questionBankIdList.value)
    router.push({
      name: 'list',
    })
  } else if (props.active) {
    // 添加试卷（组件式）
    const res = await createExamPaper(questionBankIdList.value)
    if (res.code == 0) {
      emit('changeActive', { active: 3, id: res.data.ID })
    }
  } else {
    // 添加试卷（跳转式）
    const res = await createExamPaper(questionBankIdList.value)
    if (res.code == 0) {
      ElMessage.success(res.msg)
      router.push({
        name: 'list',
      })
    }
  }
}
// 弹窗相关
const dialogVisible = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const handleCommand = (command) => {
  dialogVisible.value = true
  selectTable.value.quType = command
  initQuestionList()
  initQuestionBankList()
}
// 搜索框
const selectTable = ref({
  quType: '',
  questionBankID: '',
  content: '',
})
// 输入框信息改变
const inputChange = () => {
  initQuestionList()
}
const closeDialog = () => {
  dialogVisible.value = false
}
// 表格选项改变
const multipleSelection = ref([])
const subDialogData = ref([])
const disSeletion = ref([])
const person = ref(0)
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  person.value = val.length
  subDialogData.value = val.map((item, index) => {
    return item.ID
  })
}
// 设置禁选项
const disallowSeletion = (row, index) => {
  let choose = true
  disSeletion.value.map((item) => {
    if (item == row.ID) choose = false
  })
  return choose
}
// 提交选中信息
const submitDialogData = () => {
  subDialogData.value.map((item, index) => {
    examQuestion(item)
    questionsNumber.value++
  })
  disSeletion.value = Array.from(
    new Set(disSeletion.value.concat(subDialogData.value)),
  )
  dialogVisible.value = false
}
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val // 每页显示个数
  initQuestionList()
}
const handleCurrentChange = (val) => {
  page.value = val // 当前页
  initQuestionList()
}
// 该功能未完成
const unfinish = () => {
  ElMessage('该功能暂未实现')
}
</script>

<style lang="scss" scoped>
@import '@/style/element_visiable.scss';
.topic_score {
  width: 60px;
  margin: 5px;
}
.all-box-left {
  width: 250px;
  flex: 0 0 250px;
}
.left-box {
  width: 250px;
  height: calc(100vh - 120px);
  position: fixed;
  overflow: auto;
  clear: both;
  .question-box {
    border: 1px dashed #eee;
    padding: 10px;
    margin: 2px 0;
    .el-divider {
      margin: 5px 0;
    }
  }
}
.group-card {
  margin-bottom: 15px;
  line-height: 28px;
  width: 100%;
}
.card-manage div {
  font-size: 16px;
  font-weight: 700;
}
.all-box-right {
  -webkit-box-flex: 1;
  flex-grow: 1;
  padding-left: 20px;
}
.tool-box {
  padding: 20px;
  background: rgb(238, 238, 238);
  margin-bottom: 20px;
  border-radius: 5px;
}
.upLoad-btn {
  position: relative;
  top: 50%; /*偏移*/
  transform: translateY(-50%);
  text-align: center;
}
/* 题目列表卡片 */
.content-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 题目内容 */
.list-box {
  display: flex;
  padding-bottom: 20px;
  border-bottom: #eee 3px dotted;
  margin-bottom: 20px;
  .list-qu {
    flex-grow: 1;
    padding-right: 20px;
    .qu-box {
      margin-bottom: 20px;
      .qu-item {
        display: flex;
        margin-bottom: 20px;
        /* 题号 */
        .num {
          display: inline-block;
          background: url(@/assets/tihao.png) no-repeat 100% 100%;
          background-size: contain;
          height: 30px;
          width: 30px;
          line-height: 25px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .content {
          -webkit-box-flex: 1;
          flex-grow: 1;
          -webkit-box-align: start;
          align-items: flex-start;
        }
      }
      .qu-answer {
        /* 选项 */
        .item {
          display: flex;
          border: #eee 1px solid;
          border-radius: 5px;
          line-height: 20px;
          margin: 15px 0px 15px 0px;
          padding: 10px;
          cursor: pointer;
          font-size: 14px;
          .tag {
            width: 10px;
            font-weight: 700;
            color: #0a84ff;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
          }
          .content {
            -webkit-box-flex: 1;
            flex-grow: 1;
            padding-left: 10px;
          }
          .right {
            width: 50px;
            flex-shrink: 0;
          }
        }
      }
      .as-box {
        border: #eee 1px solid;
        border-radius: 5px;
        line-height: 24px;
        margin: 5px 0px 10px 0px;
        padding: 10px;
        font-size: 14px;
        color: #555;
        background: #fcfcfc;
      }
    }
    // 组合题专用
    .sub-box {
      display: flex;
      width: 100%;
      border: #eee 1px solid;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  }
  /* 卡片右侧 */
  .list-opt {
    width: 200px;
    text-align: center;
    font-size: 12px;
    line-height: 36px;
    flex-shrink: 0;
    .opt-box {
      background: #eee;
      padding: 10px;
      text-align: center;
      margin-top: 10px;
      width: 180px;
      float: right;
    }
  }
}

:deep(.btns .el-input),
:deep(.btns .el-select) {
  width: 180px;
  height: 36px;
  line-height: 36px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.num_blue {
  color: #0a84ff;
  margin: 0 5px;
  cursor: pointer;
}
</style>

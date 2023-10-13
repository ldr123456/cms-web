<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-row :gutter="20" style="padding: 0">
          <el-col :span="24">
            <h2>统计总览</h2>
          </el-col>
          <el-col :span="24">
            <el-card style="background: #0a84ff">
              <div style="display: flex; justify-content: space-around">
                <div
                  class="data-box"
                  v-for="(state, key) in statisticData"
                  :key="key"
                >
                  <div class="data-title">{{ state.label }}</div>
                  <div class="data-content">
                    <a>
                      <span>{{ state.number }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 0">
          <el-col :span="24">
            <h2>快捷入口</h2>
          </el-col>
          <el-col
            v-for="(card, key) in toolCards"
            :key="key"
            :span="8"
            @click="toTarget(card.name)"
          >
            <el-card style="margin-bottom: 20px; cursor: pointer">
              <div class="opt-item">
                <div class="opt-icon">
                  <img :src="card.url" alt="图片加载失败" />
                </div>
                <div class="opt-content">
                  <h3>{{ card.label }}</h3>
                  <div>{{ card.msg }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <h2>系统公告</h2>
        <el-card style="height: 326px; overflow: auto">
          <div
            class="man-data"
            v-for="(item, index) in manageData"
            :key="index"
          >
            {{ item.title }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom: 20px; height: 360px">
          <h3>进行中的考试</h3>
          <el-table :data="examData" border tooltip-effect="dark" max-height="300">
            <el-table-column
              prop="ExamName"
              label="考试名称"
              min-width="250"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              prop="ExamingCount"
              label="正在考试"
              min-width="50"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              prop="ExamFinishCount"
              label="考完人数"
              min-width="50"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom: 20px; height: 360px">
          <h3>考试总览</h3>
          <ExamEcharts />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom: 20px; height: 360px">
          <h3>进行中的课程</h3>
          <el-table :data="courseData" border tooltip-effect="dark" max-height="300">
            <el-table-column
              prop="Name"
              label="课程名称"
              min-width="250"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              prop="ProcCount"
              label="学习人数"
              min-width="50"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              prop="FinishCount"
              label="学完人数"
              min-width="50"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom: 20px; height: 360px">
          <h3>学习总览</h3>
          <StudentEcharts />
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card style="margin-bottom: 20px; height: 360px">
          <h3>用户总览</h3>
          <UserEcharts />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import ExamEcharts from '@/view/dashboard/dashboardCharts/examEcharts.vue'
import StudentEcharts from '@/view/dashboard/dashboardCharts/studentEcharts.vue'
import UserEcharts from '@/view/dashboard/dashboardCharts/userEcharts.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherInfo } from '@/view/dashboard/weather.js'
import {
  getManageStatisticsAll,
  getDashExamList,
  getDashCourseList,
  getPagingNotice
} from '@/api/manage.js'

const router = useRouter()

const weatherInfo = useWeatherInfo()
// 统计总览
const statisticData = ref([
  {
    label: '考试场数',
    number: 0,
  },
  {
    label: '题库数量',
    number: 0,
  },
  {
    label: '试题总数',
    number: 0,
  },
  {
    label: '课程总数',
    number: 0,
  },
  {
    label: '课件总数',
    number: 0,
  },
  {
    label: '用户总数',
    number: 0,
  },
])
// 快捷入口
const toolCards = ref([
  {
    label: '创建考试',
    name: 'addExam',
    url: '/src/assets/dashboard/exam.png',
    msg: '快速创建一场考试，支持多种选题方式',
  },
  {
    label: '添加课程',
    name: 'addcourse',
    url: '/src/assets/dashboard/course.png',
    msg: '添加课程课件，支持Office/PDF/视频',
  },
  {
    label: '题库管理',
    name: 'questionBankManage',
    url: '/src/assets/dashboard/question.png',
    msg: '批量导入导出、设定章节、题目难易程度',
  },
  {
    label: '证书管理',
    name: '',
    url: '/src/assets/dashboard/cert.png',
    msg: '定制证书，支持规则自动发放、人工颁发',
  },
  {
    label: '知识竞赛',
    name: '',
    url: '/src/assets/dashboard/battle.png',
    msg: '开启知识竞赛，勇攀知识高峰',
  },
  {
    label: '公告管理',
    name: 'paManage',
    url: '/src/assets/dashboard/notice.png',
    msg: '发布日常公告、新闻及提醒事项',
  },
])
// 系统公告
const manageData = ref([])
const examData = ref([])
const courseData = ref([])
// 统计信息
const initStatistics = async () => {
  const { data } = await getManageStatisticsAll()
  var count = 0
  for (let key in data) {
    statisticData.value[count].number = data[key]
    count++
  }
}
// 公告信息
const initNotice = async () => {
  const { data } = await getPagingNotice({
    page: 1,
    pageSize: 5
  })
  manageData.value = data.getPagingNotice
}
// 表格信息
const initExamInfo = async () => {
  const { data } = await getDashExamList()
  examData.value = data.list
}
const initCourseInfo = async () => {
  const { data } = await getDashCourseList()
  courseData.value = data.list
}
const initManage = async () => {
  initStatistics()
  initNotice()
  initExamInfo()
  initCourseInfo()
}
initManage()
const toTarget = (name) => {
  router.push({ name })
}
</script>

<style lang="scss" scoped>
@mixin flex-center {
  display: flex;
  align-items: center;
}
h3 {
  margin: 5px;
}
.page {
  background: #f0f2f5;
  padding: 10px;
  .data-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .data-title {
      font-size: 16px;
      font-weight: 700;
      color: #afd5fa;
      text-align: center;
    }
    .data-content {
      font-size: 26px;
      font-weight: 700;
      color: #fdf7d6;
      margin-top: 10px;
      text-align: center;
      a {
        cursor: pointer;
        color: #fdf7d6;
        font-weight: 700;
      }
      a:hover {
        color: #ff8000;
      }
    }
  }
  ::v-deep(.el-card__body) {
    padding: 10px;
    .opt-item {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .opt-icon {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
        }
      }
      .opt-content {
        width: 200px;
        flex-grow: 1;
        padding-left: 10px;
        line-height: 30px;
      }
    }
  }
  .man-data {
    color: #0a84ff;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }
  .man-data:hover {
    color: #ff8000;
    background: #f5f7fa;
  }
}
</style>

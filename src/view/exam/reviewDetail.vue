<template>
  <div>
    <div class="all-box">
      <div class="all-box-left">
        <el-card class="left-box left-box-normal" style="width: 250px">
          <div class="group-card">
            <template v-for="(item, index) in userPaperDetail.groupList" :key="index">
              <div v-if="item">
                <!-- <div> -->
                <div style="line-height: 40px">
                  <el-button type="text" style="font-size: 14px; font-weight: 700">
                    {{ item.quType_dictText }}
                  </el-button>
                  <el-divider style="margin: 5px 0" />
                </div>
                <div class="group-card-body">
                  <div>
                    共
                    <i class="num">{{ item.quCount }}</i>
                    题，共
                    <i class="num">{{ item.totalScore }}</i>
                    分
                  </div>
                </div>
                <div class="card-box">
                  <div class="item" v-for="(i, index) in item.quList" :key="index">
                    <div class="num right" v-if="i.isRight">{{ i.ID }}</div>
                    <div class="num error" v-else>{{ i.ID }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-card>
      </div>
      <div class="all-box-center">
        <template v-for="(items, indexs) in userPaperDetail.groupList" :key="indexs">
          <el-card
            class="content-card"
            v-for="(item, index) in items.quList"
            :key="index"
          >
            <div>
              <div class="list-box">
                <div class="list-qu">
                  <div class="qu-box">
                    <div class="qu-item">
                      <div class="num">{{ item.ID }}</div>
                      <div class="content">
                        <span>{{ item.content }}</span>
                      </div>
                    </div>
                    <!-- 遍历选项 -->
                    <div
                      class="qu-answer"
                      v-if="
                        items.quType_dictText != '简答题' ||
                        items.quType_dictText != '组合题'
                      "
                    >
                      <div class="item" v-for="(i, inde) in item.answerList" :key="inde">
                        <div class="tag">{{ i.tag }}</div>
                        <div class="content">
                          <div>{{ i.content }}</div>
                        </div>
                        <div class="right" v-if="i.checked">
                          <el-icon style="color: rgb(26, 172, 26)">
                            <SuccessFilled /> </el-icon
                          >学生答案
                        </div>
                        <div class="right" v-if="i.isRight">
                          <el-icon style="color: rgb(26, 172, 26)">
                            <SuccessFilled /> </el-icon
                          >正确答案
                        </div>
                      </div>
                    </div>
                    <div class="as-box" v-if="items.quType_dictText != '组合题'">
                      <div>
                        <div>
                          <div class="right-line" v-if="item.isRight">
                            <el-icon class="right"><SuccessFilled /></el-icon>
                            <span>答对了</span>
                          </div>
                          <div class="right-line" v-else>
                            <el-icon class="error"><CircleCloseFilled /></el-icon>
                            <span>答错了</span>
                          </div>
                        </div>
                        <div>
                          学员得分：<span>{{ item.score }}</span>
                        </div>
                      </div>
                      <div>
                        <div>大题解析：</div>
                        <div>
                          {{ item.analysis }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 组合题专用 -->
                  <!-- <div v-if="items.quType_dictText === '组合题'">
                    <div
                      class="list-sub-box"
                      v-for="(i, index) in item.QuMarks"
                      :key="index"
                    >
                      <div class="list-sub-qu">
                        <div class="qu-box sub-box">
                          <div class="qu-item">
                            <div class="num">题号</div>
                            <div class="content"><span>题目</span></div>
                          </div>
                          <div class="qu-answer" v-if="index != 'JudgeQuSectionAnswer'">
                            <div class="item">
                              <div class="tag">A</div>
                              <div class="content">
                                <div>选项1</div>
                              </div>
                              <div class="right">
                                <el-icon style="color: rgb(26, 172, 26)">
                                  <SuccessFilled /> </el-icon
                                >答案
                              </div>
                            </div>
                            <div class="item">
                              <div class="tag">A</div>
                              <div class="content">
                                <div>选项1</div>
                              </div>
                            </div>
                          </div>
                          <div class="as-box">
                            <div>
                              <div>
                                <div class="right-line">
                                  <el-icon class="error"><CircleCloseFilled /></el-icon>
                                  <span>答错了</span>
                                </div>
                              </div>
                              <div>学员得分：<span>0</span></div>
                              <div>学员答案：<span>D</span></div>
                            </div>
                            <div>
                              <div>题目解析</div>
                              <div>
                                《道路交通安全法实施条例》第五十三条：机动车遇有前方交叉路口交通阻塞时，应当依次停在路口以外等候，不得进入路口。
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="list-sub-opt">
                        <div class="check-box">
                          <div class="item">
                            判题：
                            <el-icon
                              class="check-icon check-icon-right"
                              :class="selectRight"
                            >
                              <SuccessFilled />
                            </el-icon>
                            <el-icon
                              class="check-icon check-icon-error"
                              :class="selectError"
                            >
                              <CircleCloseFilled />
                            </el-icon>
                          </div>
                          <div class="item">
                            得分：
                            <el-input-number
                              v-model="num"
                              :precision="1"
                              :step="0.1"
                              max="maxScore"
                            />
                          </div>
                          <div class="item">总分：10</div>
                        </div>
                      </div>
                    </div>
                  </div> -->
                </div>
                <div class="list-opt" v-if="items.quType_dictText != '组合题'">
                  <div class="check-box">
                    <div class="item">
                      判题：
                      <el-icon
                        class="check-icon"
                        :class="{ 'check-icon-right': item.isRight }"
                        @click="changeRight(item)"
                      >
                        <SuccessFilled />
                      </el-icon>
                      <el-icon
                        class="check-icon"
                        :class="{ 'check-icon-error': !item.isRight }"
                        @click="changeRight(item)"
                      >
                        <CircleCloseFilled />
                      </el-icon>
                    </div>
                    <div class="item">
                      得分：
                      <el-input-number
                        v-model="item.score"
                        :precision="1"
                        :step="0.5"
                        :max="item.qu_score"
                        min="0"
                        @change="computeScore"
                      />
                    </div>
                    <div class="item">总分：{{ item.qu_score }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </template>
        <el-card>
          <el-input
            v-model="textarea"
            :rows="2"
            type="textarea"
            placeholder="请输入您的评语！"
          />
        </el-card>
      </div>
      <div class="all-box-right">
        <el-card class="left-box left-box-normal" style="width: 200px">
          <div>人员姓名</div>
          <div style="color: rgb(10, 132, 255)">{{ userPaperDetail.user_name }}</div>
          <el-divider style="margin: 5px 0" />
          <div>考试成绩</div>
          <div style="color: rgb(255, 75, 80)">
            {{ userPaperDetail.UserTotalScore }}
          </div>
          <el-divider style="margin: 5px 0" />
          <div>仅看错题</div>
          <div>
            <el-switch
              v-model="questionScreen.errQuestion"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            ></el-switch>
          </div>
          <el-divider style="margin: 5px 0" />
          <div>仅看主观题</div>
          <div>
            <el-switch
              v-model="questionScreen.subQuestion"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            ></el-switch>
          </div>
          <el-divider style="margin: 5px 0" />
          <div>考试状态</div>
          <div v-if="userPaperDetail.PassState === 1" style="color: #03dd6d">
            {{ userPaperDetail.PassStateName }}
          </div>
          <div v-else style="color: #ff4b50">{{ userPaperDetail.PassStateName }}</div>
          <el-divider style="margin: 5px 0" />
          <el-button type="primary" size="large" @click="subPaper">提交阅卷</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { markPaperByPerson, getEachExamResultDetail } from "@/api/review.js";
const route = useRoute();
const router = useRouter();
// 获取用户信息
const userPaperDetail = ref({
  exam_user_name: "学员",
  user_single_qu_score: "0",
  state: "通过",
});
const getUserDetail = async () => {
  const { data } = await getEachExamResultDetail({
    exam_user_id: Number(route.query.exam_user_id),
    exam_id: Number(route.query.exam_id),
    frq: Number(route.query.frq),
  });
  userPaperDetail.value = data;
};
const initDetail = () => {
  getUserDetail();
};
initDetail();
// 批改试题
const changeRight = (item) => {
  item.isRight = !item.isRight;
  if (item.isRight) {
    item.score = item.qu_score;
  } else {
    item.score = 0;
  }
  computeScore();
};
// 计算考试成绩
const computeScore = () => {
  userPaperDetail.value.UserTotalScore = 0;
  for (let item in userPaperDetail.value.groupList) {
    userPaperDetail.value.groupList[item].totalScore = 0;
    userPaperDetail.value.groupList[item].quList.forEach((i) => {
      userPaperDetail.value.groupList[item].totalScore += i.score;
      userPaperDetail.value.UserTotalScore += i.score;
    });
  }
};
// 题目筛选
const questionScreen = ref({
  errQuestion: "false",
  subQuestion: "false",
});
// 提交阅卷
const subPaper = async () => {
  ElMessageBox.confirm("是否确定提交评卷结果", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await markPaperByPerson(userPaperDetail.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: res.msg,
        });
        router.push({
          name: "reviewList",
          // 传入选中项id
          params: {
            id: route.query.id,
          },
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消保存",
      });
    });
};
</script>

<script setup></script>

<style lang="scss" scoped>
.all-box {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  .all-box-left {
    width: 250px;
    -webkit-box-flex: 0;
    flex: 0 0 250px;
    .left-box-normal {
      top: 103px;
    }
    .left-box {
      height: calc(100vh - 120px);
      position: fixed;
      overflow: auto;
      clear: both;
      // 左侧试题统计
      .group-card {
        margin-bottom: 15px;
        line-height: 28px;
        width: 100%;
        .num {
          color: #1890ff;
        }
        .group-card-body {
          line-height: 22px;
          font-size: 14px;
        }
        .card-box {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          margin-left: -5px;
          margin-top: 10px;
          .item {
            width: 30px;
            height: 40px;
            background: #eee;
            border-radius: 2px;
            font-size: 12px;
            -webkit-box-align: center;
            align-items: center;
            cursor: pointer;
            margin: 5px 5px 10px 5px;
            .right {
              border-radius: 2px;
              background: #1890ff;
              color: #fff !important;
            }
            .error {
              border-radius: 2px;
              background: #ff4b50;
              color: #fff !important;
            }
            .num {
              text-align: center;
              color: #555;
              font-weight: 700;
              padding: 3px;
              height: 20px;
              line-height: 14px !important;
            }
          }
        }
      }
    }
  }
  .all-box-center {
    -webkit-box-flex: 1;
    flex-grow: 1;
    padding-left: 20px;
    padding-right: 20px;
    // 试题详情
    .content-card {
      margin-bottom: 20px;
      line-height: 28px;
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
                -ms-flex-negative: 0;
                flex-shrink: 0;
              }
              .content {
                -webkit-box-flex: 1;
                flex-grow: 1;
                -webkit-box-align: start;
              }
            }
            .qu-answer {
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
                  width: 70px;
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
              .right-line {
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                font-weight: 700;
                font-size: 16px;
                margin-bottom: 10px;
                .right {
                  color: #03dd6d;
                  font-size: 22px;
                  margin-right: 10px;
                }
                .error {
                  color: #ff4b50;
                  font-size: 22px;
                  margin-right: 10px;
                }
              }
            }
          }
          // 组合题专用
          .list-sub-box {
            display: flex;
            margin-bottom: 20px;
            border: #efefef 1px solid;
            border-radius: 5px;
            padding: 10px;
            margin-right: -20px;
            .list-sub-qu {
              -webkit-box-flex: 1;
              flex-grow: 1;
              padding-right: 20px;
              .sub-box {
                margin: 20px 0px 20px 0px;
              }
            }
          }
          .list-sub-opt {
            width: 200px;
            text-align: center;
            font-size: 12px;
            line-height: 36px;
            flex-shrink: 0;
          }
        }
        // 右侧判题
        .list-opt {
          width: 200px;
          text-align: center;
          font-size: 12px;
          line-height: 36px;
          flex-shrink: 0;
        }
      }
    }
  }
  // 右侧试题判断
  .check-box {
    background: #f5f5f5;
    padding: 20px;
    line-height: 40px;
    width: 200px;
    font-size: 14px;
    font-weight: 700;
    .item {
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      -webkit-box-align: center;
      align-items: center;
      .check-icon {
        font-size: 28px;
        color: #ddd;
        cursor: pointer;
        margin-right: 10px;
      }
      .check-icon-right {
        color: #03dd6d;
      }
      .check-icon-error {
        color: #ff4b50;
      }
    }
  }
  .all-box-right {
    width: 200px;
    -webkit-box-flex: 0;
    flex: 0 0 200px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    font-weight: 700;
    .left-box-normal {
      top: 103px;
    }
    .left-box {
      height: calc(100vh - 120px);
      position: fixed;
      overflow: auto;
      clear: both;
    }
  }
}
</style>

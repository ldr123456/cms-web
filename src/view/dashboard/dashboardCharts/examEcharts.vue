<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-05-10 20:39:21
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-05-11 10:55:55
 * @FilePath: \cms-web\src\view\dashboard\dashboardCharts\examEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dashboard-line-box">
    <div ref="echart" class="dashboard-line" />
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'

var xDataArr = ['05/04', '05/05', '05/06', '05/07', '05/08', '05/09', '05/10']
var yDataArr1 = [120, 132, 101, 134, 90, 230, 210]
var yDataArr2 = [20, 82, 191, 94, 290, 330, 310]
var yDataArr3 = [200, 182, 191, 194, 290, 33, 510]

const chart = shallowRef(null)
const echart = ref(null)
const initChart = () => {
  chart.value = echarts.init(echart.value)
  setOptions()
}
const setOptions = () => {
  chart.value.setOption({
    toolbox: {
      feature: {
        saveAsImage: {}, //图片下载功能
      },
    },
    xAxis: {
      type: 'category',
      data: xDataArr,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      scale: true,
    },
    legend: {
      data: ['考试人次', '考试人数', '通过人数'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    series: [
      {
        name: '考试人次',
        type: 'line',
        data: yDataArr1,
      },
      {
        name: '考试人数',
        type: 'line',
        data: yDataArr2,
      },
      {
        name: '通过人数',
        type: 'line',
        data: yDataArr3,
      },
    ],
  })
}

onMounted(async () => {
  await nextTick()
  initChart()
})

onUnmounted(() => {
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = null
})
</script>
<style lang="scss" scoped>
.dashboard-line-box {
  .dashboard-line {
    background-color: #fff;
    height: 360px;
    width: 100%;
  }
}
</style>

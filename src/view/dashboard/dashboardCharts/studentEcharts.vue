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

const chart = shallowRef(null)
const echart = ref(null)
const initChart = () => {
  chart.value = echarts.init(echart.value)
  setOptions()
}
const setOptions = () => {
  chart.value.setOption({
    xAxis: {
      type: 'category',
      data: xDataArr,
    },
    yAxis: {
      type: 'value',
      scale: true,
    },
    legend: {
      data: ['学习人数', '学完人数'],
    },
    saveAsImage: {}, // 将图表保存为图片
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    series: [
      {
        name: '学习人数',
        type: 'bar',
        data: yDataArr1,
      },
      {
        name: '学完人数',
        type: 'bar',
        data: yDataArr2,
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

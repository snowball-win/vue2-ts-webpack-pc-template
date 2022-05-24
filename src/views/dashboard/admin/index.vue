<template>
  <div class="dashboard-editor-container">
    <panel-group @handle-set-line-chart-data="handleSetLineChartData" />
    <div class="period">
      <div class="content">
        <el-button>本周</el-button>
        <el-button>本月</el-button>
        <el-button>本年度</el-button>
        <!-- <el-button>请选择时间范围</el-button> -->
        <el-date-picker
          class="dataTime"
          v-model="dateTime"
          value-format="yyyy-MM-dd"
          @change="dateChangeHandle"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']">
        </el-date-picker>
      </div>
    </div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
// import GithubCorner from '@/components/GithubCorner/index.vue'
import BarChart from './components/BarChart.vue'
// import BoxCard from './components/BoxCard.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import PanelGroup from './components/PanelGroup.vue'
// import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
import TodoList from './components/TodoList/index.vue'
import TransactionTable from './components/TransactionTable.vue'

const lineChartData: { [type: string]: ILineChartData } = {
  newVisitis: {
    orderData: [100, 120, 161, 134, 105, 160, 165],
    moneyData: [120, 82, 91, 154, 162, 140, 145],
    periodData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  messages: {
    orderData: [200, 192, 120, 144, 160, 130, 140],
    moneyData: [180, 160, 151, 106, 145, 150, 130],
    periodData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  purchases: {
    orderData: [80, 100, 121, 104, 105, 90, 100],
    moneyData: [120, 90, 100, 138, 142, 130, 130],
    periodData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  shoppings: {
    orderData: [130, 140, 141, 142, 145, 150, 160],
    moneyData: [120, 82, 91, 154, 162, 140, 130],
    periodData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  }
}

@Component({
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    BarChart,
    // BoxCard,
    LineChart,
    PanelGroup,
    // PieChart,
    RadarChart,
    TodoList,
    TransactionTable
  }
})
export default class extends Vue {
  private lineChartData = lineChartData.newVisitis

  private dateTime = ''

  private dateChangeHandle(value: any) {
    console.log('82value', value)
  }

  private handleSetLineChartData(type: string) {
    this.lineChartData = lineChartData[type]
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .period{
    display: flex;
    justify-content: flex-end;
    .content{
      .dataTime{
        margin-left: 10px;
      }
    }
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

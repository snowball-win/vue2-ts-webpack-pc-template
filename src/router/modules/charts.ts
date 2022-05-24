import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const chartsRouter: RouteConfig = {
  path: '/charts',
  component: Layout,
  redirect: 'noredirect',
  name: 'Charts',
  meta: {
    title: 'route.charts',
    icon: 'chart'
  },
  children: [
    {
      path: 'bar-chart',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/charts/bar-chart.vue'),
      name: 'BarChartDemo',
      meta: {
        title: 'route.barChart',
        noCache: true
      }
    },
    {
      path: 'line-chart',
      component: () => import(/* webpackChunkName: "line-chart" */ '@/views/charts/line-chart.vue'),
      name: 'LineChartDemo',
      meta: {
        title: 'route.lineChart',
        noCache: true
      }
    },
    {
      path: 'mixed-chart',
      component: () => import(/* webpackChunkName: "mixed-chart" */ '@/views/charts/mixed-chart.vue'),
      name: 'MixedChartDemo',
      meta: {
        title: 'route.mixedChart',
        noCache: true
      }
    }
  ]
}

export default chartsRouter

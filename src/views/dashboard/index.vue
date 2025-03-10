<template>
  <div class="dashboard-workplace">
    <!-- 数据概览 -->
    <n-card title="数据概览">
      <n-grid :cols="4" :x-gap="12" :y-gap="8">
        <n-grid-item>
          <n-card>
            <n-statistic label="在线用户" :value="1234">
              <template #prefix>
                <n-icon>
                  <PersonOutline />
                </n-icon>
              </template>
              <template #suffix>
                <n-tag type="success" size="small">
                  <template #icon>
                    <n-icon><TrendingUpOutline /></n-icon>
                  </template>
                  12%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card>
            <n-statistic label="总访问量" :value="123456">
              <template #prefix>
                <n-icon>
                  <EyeOutline />
                </n-icon>
              </template>
              <template #suffix>
                <n-tag type="info" size="small">
                  <template #icon>
                    <n-icon><TrendingUpOutline /></n-icon>
                  </template>
                  8%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card>
            <n-statistic label="订单总量" :value="8234">
              <template #prefix>
                <n-icon>
                  <CartOutline />
                </n-icon>
              </template>
              <template #suffix>
                <n-tag type="warning" size="small">
                  <template #icon>
                    <n-icon><TrendingDownOutline /></n-icon>
                  </template>
                  3%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card>
            <n-statistic label="总收入" :value="123456" show-group-separator>
              <template #prefix>¥</template>
              <template #suffix>
                <n-tag type="success" size="small">
                  <template #icon>
                    <n-icon><TrendingUpOutline /></n-icon>
                  </template>
                  15%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 图表区域 -->
    <n-grid :cols="2" :x-gap="12" class="mt-4">
      <n-grid-item>
        <n-card title="访问量趋势">
          <div class="h-400px">
            <n-empty v-if="!chartData" description="暂无数据" />
            <div v-else ref="visitChartRef" class="h-full w-full"></div>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="用户分布">
          <div class="h-400px">
            <n-empty v-if="!chartData" description="暂无数据" />
            <div v-else ref="userChartRef" class="h-full w-full"></div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快捷操作 -->
    <n-card title="快捷操作" class="mt-4">
      <n-grid :cols="4" :x-gap="12">
        <n-grid-item v-for="action in quickActions" :key="action.title">
          <n-card hoverable @click="handleQuickAction(action)">
            <div class="flex items-center">
              <n-icon size="24" :component="action.icon" />
              <span class="ml-2">{{ action.title }}</span>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import {
  PersonOutline,
  EyeOutline,
  CartOutline,
  TrendingUpOutline,
  TrendingDownOutline,
  AddOutline,
  DocumentTextOutline,
  SettingsOutline,
  NotificationsOutline,
} from '@vicons/ionicons5'
import * as echarts from 'echarts'

const message = useMessage()
const visitChartRef = ref<HTMLElement | null>(null)
const userChartRef = ref<HTMLElement | null>(null)
const chartData = ref(true) // 模拟数据加载状态

// 快捷操作
const quickActions = [
  { title: '新增用户', icon: AddOutline },
  { title: '发布文章', icon: DocumentTextOutline },
  { title: '系统设置', icon: SettingsOutline },
  { title: '查看通知', icon: NotificationsOutline },
]

// 处理快捷操作点击
const handleQuickAction = (action: typeof quickActions[0]) => {
  message.info(`点击了${action.title}`)
}

onMounted(() => {
  let visitChart: echarts.ECharts | null = null
  let userChart: echarts.ECharts | null = null

  // 初始化访问量趋势图表
  if (visitChartRef.value) {
    visitChart = echarts.init(visitChartRef.value)
    visitChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          areaStyle: {},
        },
      ],
    })
  }

  // 初始化用户分布图表
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
    userChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '企业用户' },
            { value: 735, name: '个人用户' },
            { value: 580, name: '开发者' },
            { value: 484, name: '其他' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }

  // 监听窗口大小变化，重绘图表
  const handleResize = () => {
    visitChart?.resize()
    userChart?.resize()
  }
  window.addEventListener('resize', handleResize)

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    visitChart?.dispose()
    userChart?.dispose()
  })
})
</script>

<style scoped>
.dashboard-workplace {
  padding: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.h-400px {
  height: 400px;
}

.h-full {
  height: 100%;
}

.w-full {
  width: 100%;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.ml-2 {
  margin-left: 8px;
}
</style> 
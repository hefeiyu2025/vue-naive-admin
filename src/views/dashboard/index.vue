<template>
  <div class="dashboard-container">
    <!-- 欢迎信息 -->
    <n-card :bordered="false" class="welcome-card">
      <n-grid :cols="24" :x-gap="16">
        <n-grid-item :span="16">
          <div class="welcome-info">
            <h2>{{ t('dashboard.welcome') }}，{{ userStore.userInfo?.username }}</h2>
            <p>{{ t('dashboard.today') }} {{ today }}，{{ t('dashboard.wish') }}</p>
          </div>
        </n-grid-item>
        <n-grid-item :span="8">
          <div class="weather-info">
            <n-icon size="48" class="weather-icon">
              <partly-sunny-outline />
            </n-icon>
            <div class="weather-text">
              <h3>{{ t('dashboard.weather.sunny') }} 28°C</h3>
              <p>{{ t('dashboard.weather.location') }}</p>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 数据概览 -->
    <n-grid :cols="24" :x-gap="16" :y-gap="16" class="statistics-grid">
      <n-grid-item :span="6" v-for="item in statistics" :key="item.title">
        <n-card :bordered="false">
          <div class="statistics-item">
            <div class="statistics-info">
              <p class="label">{{ t(item.title) }}</p>
              <h3 class="value">{{ item.value }}</h3>
              <div class="trend">
                <n-icon :color="item.trend > 0 ? '#18a058' : '#d03050'">
                  <arrow-up-outline v-if="item.trend > 0" />
                  <arrow-down-outline v-else />
                </n-icon>
                <span>{{ Math.abs(item.trend) }}%</span>
                <span class="compared">{{ t('dashboard.compared') }}</span>
              </div>
            </div>
            <div class="statistics-icon">
              <n-icon size="48" :color="item.color">
                <component :is="item.icon" />
              </n-icon>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 图表展示 -->
    <n-grid :cols="24" :x-gap="16" :y-gap="16" class="chart-grid">
      <n-grid-item :span="16">
        <n-card :title="t('dashboard.charts.visits')" :bordered="false">
          <div ref="visitChart" class="chart"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item :span="8">
        <n-card :title="t('dashboard.charts.users')" :bordered="false">
          <div ref="userChart" class="chart"></div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快捷操作 -->
    <n-card :title="t('dashboard.shortcuts.title')" :bordered="false" class="shortcut-card">
      <n-grid :cols="24" :x-gap="16">
        <n-grid-item :span="6" v-for="item in shortcuts" :key="item.title">
          <div class="shortcut-item" @click="item.onClick">
            <n-icon size="32" :color="item.color">
              <component :is="item.icon" />
            </n-icon>
            <span>{{ t(item.title) }}</span>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import {
  PartlySunnyOutline,
  ArrowUpOutline,
  ArrowDownOutline,
  PeopleOutline,
  CartOutline,
  CashOutline,
  EyeOutline,
  PersonAddOutline,
  DocumentTextOutline,
  SettingsOutline,
  NotificationsOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

// 今日日期
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

// 统计数据
const statistics = [
  {
    title: 'dashboard.stats.users',
    value: '12,321',
    trend: 12.5,
    color: '#7050f2',
    icon: PeopleOutline,
  },
  {
    title: 'dashboard.stats.orders',
    value: '1,234',
    trend: -2.5,
    color: '#2080f0',
    icon: CartOutline,
  },
  {
    title: 'dashboard.stats.sales',
    value: '¥123,456',
    trend: 15.2,
    color: '#18a058',
    icon: CashOutline,
  },
  {
    title: 'dashboard.stats.visits',
    value: '45,678',
    trend: 5.5,
    color: '#f0a020',
    icon: EyeOutline,
  },
]

// 快捷操作
const shortcuts = [
  {
    title: 'dashboard.shortcuts.addUser',
    icon: PersonAddOutline,
    color: '#7050f2',
    onClick: () => router.push('/system/user'),
  },
  {
    title: 'dashboard.shortcuts.addArticle',
    icon: DocumentTextOutline,
    color: '#2080f0',
    onClick: () => router.push('/content/article'),
  },
  {
    title: 'dashboard.shortcuts.settings',
    icon: SettingsOutline,
    color: '#18a058',
    onClick: () => router.push('/system/setting'),
  },
  {
    title: 'dashboard.shortcuts.notifications',
    icon: NotificationsOutline,
    color: '#f0a020',
    onClick: () => router.push('/message/notification'),
  },
]

// 图表相关
const visitChart = ref<HTMLElement | null>(null)
const userChart = ref<HTMLElement | null>(null)

onMounted(() => {
  // 访问量趋势图
  const visitChartInstance = echarts.init(visitChart.value!)
  visitChartInstance.setOption({
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: [t('common.weekdays.mon'), t('common.weekdays.tue'), t('common.weekdays.wed'), 
             t('common.weekdays.thu'), t('common.weekdays.fri'), t('common.weekdays.sat'), t('common.weekdays.sun')],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('dashboard.charts.visits'),
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        itemStyle: {
          color: '#7050f2',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(112, 80, 242, 0.3)',
            },
            {
              offset: 1,
              color: 'rgba(112, 80, 242, 0.1)',
            },
          ]),
        },
      },
    ],
  })

  // 用户分布图
  const userChartInstance = echarts.init(userChart.value!)
  userChartInstance.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
    },
    series: [
      {
        name: t('dashboard.charts.userDistribution'),
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { value: 1048, name: t('dashboard.charts.enterprise') },
          { value: 735, name: t('dashboard.charts.personal') },
          { value: 580, name: t('dashboard.charts.developer') },
          { value: 484, name: t('dashboard.charts.other') },
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    ],
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    visitChartInstance.resize()
    userChartInstance.resize()
  })
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .welcome-card {
    .welcome-info {
      h2 {
        margin: 0;
        font-size: 24px;
        color: #1a1a1a;
      }

      p {
        margin: 8px 0 0;
        font-size: 14px;
        color: #666;
      }
    }

    .weather-info {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;

      .weather-icon {
        color: #f0a020;
      }

      .weather-text {
        text-align: right;

        h3 {
          margin: 0;
          font-size: 18px;
          color: #1a1a1a;
        }

        p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .statistics-grid {
    .statistics-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .statistics-info {
        .label {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .value {
          margin: 8px 0;
          font-size: 24px;
          color: #1a1a1a;
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;

          .compared {
            color: #666;
            margin-left: 4px;
          }
        }
      }
    }
  }

  .chart-grid {
    .chart {
      height: 300px;
    }
  }

  .shortcut-card {
    .shortcut-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s;
      border-radius: 8px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }

      span {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style> 
<template>
  <div class="notice-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              {{ t('system.notice.add') }}
            </n-button>
            <n-button @click="fetchData">
              <template #icon>
                <n-icon><refresh-outline /></n-icon>
              </template>
              {{ t('common.refresh') }}
            </n-button>
          </n-space>
          <n-space>
            <n-select
              v-model:value="queryParams.type"
              :options="typeOptions"
              :placeholder="t('system.notice.type')"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-select
              v-model:value="queryParams.status"
              :options="statusOptions"
              :placeholder="t('system.notice.status')"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-input
              v-model:value="queryParams.keyword"
              :placeholder="t('system.notice.search')"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button type="primary" @click="handleSearch">{{ t('common.search') }}</n-button>
            <n-button @click="handleReset">{{ t('common.reset') }}</n-button>
          </n-space>
        </n-space>
      </template>

      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </n-card>

    <!-- 新增/编辑公告弹窗 -->
    <n-modal
      v-model:show="showModal"
      :title="modalTitle"
      preset="card"
      :style="{ width: '800px' }"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('system.notice.title')" path="title">
          <n-input v-model:value="formData.title" :placeholder="t('system.notice.title')" />
        </n-form-item>
        <n-form-item :label="t('system.notice.type')" path="type">
          <n-select
            v-model:value="formData.type"
            :options="typeOptions"
            :placeholder="t('system.notice.type')"
          />
        </n-form-item>
        <n-form-item :label="t('system.notice.isTop')" path="isTop">
          <n-switch v-model:value="formData.isTop" />
        </n-form-item>
        <n-form-item :label="t('system.notice.expireTime')" path="expireTime">
          <n-date-picker
            v-model:formatted-value="formData.expireTimeFormatted"
            type="datetime"
            clearable
            :placeholder="t('system.notice.expireTime')"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </n-form-item>
        <n-form-item :label="t('system.notice.content')" path="content">
          <n-input
            v-model:value="formData.content"
            type="textarea"
            :placeholder="t('system.notice.content')"
            :autosize="{ minRows: 6, maxRows: 12 }"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ t('system.notice.save') }}
          </n-button>
          <n-button
            v-if="!formData.id || formData.status === '草稿'"
            type="success"
            :loading="submitting"
            @click="handleSubmitAndPublish"
          >
            {{ t('system.notice.saveAndPublish') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 查看公告弹窗 -->
    <n-modal
      v-model:show="showViewModal"
      :title="viewData.title"
      preset="card"
      :style="{ width: '800px' }"
    >
      <div class="notice-view">
        <div class="notice-header">
          <div class="notice-meta">
            <span>{{ t('system.notice.type') }}：{{ viewData.type }}</span>
            <span>{{ t('system.notice.publishTime') }}：{{ viewData.publishTime || t('system.notice.noticeStatus.draft') }}</span>
            <span>{{ t('system.notice.readCount') }}：{{ viewData.readCount || 0 }}</span>
          </div>
        </div>
        <div class="notice-content">
          {{ viewData.content }}
        </div>
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showViewModal = false">{{ t('common.cancel') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, onMounted, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import {
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
  publishNotice,
  revokeNotice,
  getNoticeDetail,
} from '@/api/notice'
import type { Notice } from '@/api/notice'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 表格数据
const loading = ref(false)
const tableData = ref<Notice[]>([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 查询参数
const queryParams = ref({
  keyword: '',
  type: null as string | null,
  status: null as string | null,
})

// 公告类型选项
const typeOptions = computed(() => [
  { label: t('system.notice.noticeType.notice'), value: '通知' },
  { label: t('system.notice.noticeType.announcement'), value: '公告' },
  { label: t('system.notice.noticeType.warning'), value: '警告' },
])

// 公告状态选项
const statusOptions = computed(() => [
  { label: t('system.notice.noticeStatus.draft'), value: '草稿' },
  { label: t('system.notice.noticeStatus.published'), value: '已发布' },
  { label: t('system.notice.noticeStatus.revoked'), value: '已撤回' },
])

// 表格列配置
const columns = computed<DataTableColumns<Notice>>(() => [
  {
    title: t('system.notice.title'),
    key: 'title',
    ellipsis: {
      tooltip: true,
    },
    render(row) {
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          onClick: () => handleView(row),
        },
        { default: () => row.title },
      )
    },
  },
  {
    title: t('system.notice.type'),
    key: 'type',
    render(row) {
      const typeMap: Record<string, string> = {
        '通知': 'info',
        '公告': 'success',
        '警告': 'warning',
      }
      return h(
        'n-tag',
        {
          type: (typeMap[row.type] || 'default') as any,
        },
        { default: () => row.type },
      )
    },
  },
  {
    title: t('system.notice.status'),
    key: 'status',
    render(row) {
      const statusMap: Record<string, string> = {
        '草稿': 'default',
        '已发布': 'success',
        '已撤回': 'warning',
      }
      return h(
        'n-tag',
        {
          type: (statusMap[row.status] || 'default') as any,
        },
        { default: () => row.status },
      )
    },
  },
  {
    title: t('system.notice.isTop'),
    key: 'isTop',
    render(row) {
      return row.isTop ? t('common.yes') : t('common.no')
    },
  },
  {
    title: t('system.notice.publishTime'),
    key: 'publishTime',
  },
  {
    title: t('system.notice.expireTime'),
    key: 'expireTime',
  },
  {
    title: t('system.notice.readCount'),
    key: 'readCount',
  },
  {
    title: t('system.notice.createBy'),
    key: 'createBy',
  },
  {
    title: t('system.notice.createTime'),
    key: 'createTime',
  },
  {
    title: t('system.notice.actions'),
    key: 'actions',
    fixed: 'right',
    width: 200,
    render(row) {
      return h('n-space', null, {
        default: () => [
          h(
            'n-button',
            {
              quaternary: true,
              type: 'primary',
              size: 'small',
              onClick: () => handleView(row),
            },
            { default: () => t('system.notice.view') },
          ),
          h(
            'n-button',
            {
              quaternary: true,
              type: 'primary',
              size: 'small',
              onClick: () => handleEdit(row),
            },
            { default: () => t('common.edit') },
          ),
          row.status === '草稿'
            ? h(
                'n-button',
                {
                  quaternary: true,
                  type: 'success',
                  size: 'small',
                  onClick: () => handlePublish(row),
                },
                { default: () => t('system.notice.publish') },
              )
            : null,
          row.status === '已发布'
            ? h(
                'n-button',
                {
                  quaternary: true,
                  type: 'warning',
                  size: 'small',
                  onClick: () => handleRevoke(row),
                },
                { default: () => t('system.notice.revoke') },
              )
            : null,
          h(
            'n-button',
            {
              quaternary: true,
              type: 'error',
              size: 'small',
              onClick: () => handleDelete(row),
            },
            { default: () => t('common.delete') },
          ),
        ],
      })
    },
  },
])

// 表单相关
const showModal = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref<Partial<Notice> & { expireTimeFormatted?: string }>({
  id: undefined,
  title: '',
  content: '',
  type: '通知',
  status: '草稿',
  isTop: false,
  expireTime: '',
  expireTimeFormatted: '',
})

const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择公告类型', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
  ],
}

// 查看公告相关
const showViewModal = ref(false)
const viewData = ref<Partial<Notice>>({})

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getNoticeList({
      keyword: queryParams.value.keyword,
      type: queryParams.value.type || undefined,
      status: queryParams.value.status || undefined,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    
    // 确保响应数据格式正确
    tableData.value = response.data.list || []
    pagination.value.itemCount = response.data.total || 0
    
    if (!response.data.list || response.data.list.length === 0) {
      message.warning(t('common.noData'))
    }
  }
  catch (error: any) {
    tableData.value = []
    pagination.value.itemCount = 0
    message.error(error.message || t('common.fetchFailed'))
  }
  finally {
    loading.value = false
  }
}

// 页码改变
const handlePageChange = (page: number) => {
  pagination.value.page = page
  fetchData()
}

// 搜索
const handleSearch = () => {
  pagination.value.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    keyword: '',
    type: null,
    status: null,
  }
  pagination.value.page = 1
  fetchData()
}

// 新增公告
const handleAdd = () => {
  modalTitle.value = t('system.notice.add')
  formData.value = {
    id: undefined,
    title: '',
    content: '',
    type: '通知',
    status: '草稿',
    isTop: false,
    expireTime: '',
    expireTimeFormatted: '',
  }
  showModal.value = true
}

// 编辑公告
const handleEdit = (row: Notice) => {
  modalTitle.value = t('system.notice.edit')
  formData.value = { 
    ...row,
    expireTimeFormatted: row.expireTime
  }
  showModal.value = true
}

// 查看公告
const handleView = async (row: Notice) => {
  try {
    const response = await getNoticeDetail(row.id)
    viewData.value = response.data
    showViewModal.value = true
  } catch (error: any) {
    message.error(error.message || t('common.fetchFailed'))
  }
}

// 删除公告
const handleDelete = (row: Notice) => {
  dialog.warning({
    title: t('common.confirmDelete'),
    content: `${t('common.confirmDelete')} "${row.title}" ?`,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await deleteNotice(row.id)
        message.success(t('common.deleteSuccess'))
        fetchData()
      } catch (error: any) {
        message.error(error.message || t('common.deleteFailed'))
      }
    }
  })
}

// 发布公告
const handlePublish = (row: Notice) => {
  dialog.info({
    title: t('system.notice.publish'),
    content: `${t('system.notice.publish')} "${row.title}" ?`,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await publishNotice(row.id)
        message.success(t('common.updateSuccess'))
        fetchData()
      } catch (error: any) {
        message.error(error.message || t('common.updateFailed'))
      }
    }
  })
}

// 撤回公告
const handleRevoke = (row: Notice) => {
  dialog.warning({
    title: t('system.notice.revoke'),
    content: `${t('system.notice.revoke')} "${row.title}" ?`,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await revokeNotice(row.id)
        message.success(t('common.updateSuccess'))
        fetchData()
      } catch (error: any) {
        message.error(error.message || t('common.updateFailed'))
      }
    }
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    
    submitting.value = true
    try {
      // 创建一个新的提交数据对象
      const submitData: Partial<Notice> = {
        id: formData.value.id,
        title: formData.value.title,
        content: formData.value.content,
        type: formData.value.type,
        status: formData.value.status,
        isTop: formData.value.isTop,
      }
      
      // 只有当设置了过期时间时才添加该字段
      if (formData.value.expireTimeFormatted && formData.value.expireTimeFormatted.trim() !== '') {
        submitData.expireTime = formData.value.expireTimeFormatted
      }
      
      console.log('提交数据:', submitData)
      
      if (formData.value.id) {
        // 更新
        await updateNotice(formData.value.id, submitData)
        message.success(t('common.updateSuccess'))
      } else {
        // 新增
        await createNotice(submitData)
        message.success(t('common.createSuccess'))
      }
      showModal.value = false
      fetchData()
    } catch (error: any) {
      console.error('提交失败:', error)
      message.error(error.message || (formData.value.id ? t('common.updateFailed') : t('common.createFailed')))
    } finally {
      submitting.value = false
    }
  })
}

// 保存并发布
const handleSubmitAndPublish = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    
    submitting.value = true
    try {
      // 创建一个新的提交数据对象
      const submitData: Partial<Notice> = {
        id: formData.value.id,
        title: formData.value.title,
        content: formData.value.content,
        type: formData.value.type,
        status: formData.value.status,
        isTop: formData.value.isTop,
      }
      
      // 只有当设置了过期时间时才添加该字段
      if (formData.value.expireTimeFormatted && formData.value.expireTimeFormatted.trim() !== '') {
        submitData.expireTime = formData.value.expireTimeFormatted
      }
      
      console.log('提交并发布数据:', submitData)
      
      let noticeId = formData.value.id
      
      if (noticeId) {
        // 更新
        await updateNotice(noticeId, submitData)
      } else {
        // 新增
        const response = await createNotice(submitData)
        noticeId = response.data.id
      }
      
      // 发布
      await publishNotice(noticeId as number)
      
      message.success(t('common.updateSuccess'))
      showModal.value = false
      fetchData()
    } catch (error: any) {
      console.error('提交并发布失败:', error)
      message.error(error.message || t('common.updateFailed'))
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.notice-container {
  height: 100%;
}

.notice-view {
  padding: 16px;
}

.notice-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.notice-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.notice-content {
  line-height: 1.6;
  white-space: pre-wrap;
}
</style> 
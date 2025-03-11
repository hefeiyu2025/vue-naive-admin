<template>
  <div class="config-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              {{ t('system.config.add') }}
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
              :placeholder="t('system.config.type')"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-select
              v-model:value="queryParams.group"
              :options="groupOptions"
              :placeholder="t('system.config.group')"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-input
              v-model:value="queryParams.keyword"
              :placeholder="t('system.config.search')"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button @click="handleSearch">{{ t('common.search') }}</n-button>
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

    <!-- 新增/编辑参数弹窗 -->
    <n-modal
      v-model:show="showModal"
      :title="modalTitle"
      preset="card"
      :style="{ width: '600px' }"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('system.config.name')" path="name">
          <n-input v-model:value="formData.name" :placeholder="t('system.config.enterName')" />
        </n-form-item>
        <n-form-item :label="t('system.config.key')" path="key">
          <n-input v-model:value="formData.key" :placeholder="t('system.config.enterKey')" />
        </n-form-item>
        <n-form-item :label="t('system.config.value')" path="value">
          <n-input v-model:value="formData.value" :placeholder="t('system.config.enterValue')" />
        </n-form-item>
        <n-form-item :label="t('system.config.type')" path="type">
          <n-select
            v-model:value="formData.type"
            :options="typeOptions"
            :placeholder="t('system.config.selectType')"
          />
        </n-form-item>
        <n-form-item :label="t('system.config.group')" path="group">
          <n-select
            v-model:value="formData.group"
            :options="groupOptions"
            :placeholder="t('system.config.selectGroup')"
            filterable
            tag
          />
        </n-form-item>
        <n-form-item :label="t('system.config.isBuiltin')" path="isBuiltin">
          <n-switch v-model:value="formData.isBuiltin" :disabled="!!formData.id" />
        </n-form-item>
        <n-form-item :label="t('system.config.status')" path="status">
          <n-switch v-model:value="formData.status" />
        </n-form-item>
        <n-form-item :label="t('system.config.remark')" path="remark">
          <n-input
            v-model:value="formData.remark"
            type="textarea"
            :placeholder="t('system.config.enterRemark')"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ t('common.confirm') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, onMounted, computed } from 'vue'
import { useMessage, useDialog, NSpace } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import {
  getConfigList,
  createConfig,
  updateConfig,
  deleteConfig,
  getConfigGroups,
} from '@/api/config'
import type { Config } from '@/api/config'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 表格数据
const loading = ref(false)
const tableData = ref<Config[]>([])
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
  group: null as string | null,
})

// 参数类型选项
const typeOptions = computed(() => [
  { label: t('system.config.systemBuiltin'), value: '系统内置' },
  { label: t('system.config.custom'), value: '自定义' },
])

// 参数分组选项
const defaultGroupOptions = computed(() => [
  { label: t('system.config.systemConfig'), value: '系统配置' },
  { label: t('system.config.emailConfig'), value: '邮件配置' },
  { label: t('system.config.smsConfig'), value: '短信配置' },
  { label: t('system.config.fileConfig'), value: '文件配置' },
])

const groupOptions = ref<{ label: string; value: string }[]>([])

// 表格列配置
const columns = computed<DataTableColumns<Config>>(() => [
  {
    title: t('system.config.name'),
    key: 'name',
  },
  {
    title: t('system.config.key'),
    key: 'key',
  },
  {
    title: t('system.config.value'),
    key: 'value',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: t('system.config.type'),
    key: 'type',
    render(row) {
      return h(
        'n-tag',
        {
          type: row.type === '系统内置' ? 'info' : 'success',
        },
        { default: () => row.type === '系统内置' ? t('system.config.systemBuiltin') : t('system.config.custom') },
      )
    },
  },
  {
    title: t('system.config.group'),
    key: 'group',
  },
  {
    title: t('system.config.status'),
    key: 'status',
    render(row) {
      return h(
        'n-tag',
        {
          type: row.status ? 'success' : 'error',
        },
        { default: () => (row.status ? t('common.enable') : t('common.disable')) },
      )
    },
  },
  {
    title: t('system.config.remark'),
    key: 'remark',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: t('system.config.createTime'),
    key: 'createTime',
  },
  {
    title: t('common.action'),
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      return h(NSpace, {
        justify: 'center',
        align: 'center',
        size: 'small'
      }, {
        default: () => [
          h(
            'n-button',
            {
              size: 'small',
              type: 'primary',
              tertiary: true,
              onClick: () => handleEdit(row),
            },
            { default: () => t('common.edit') },
          ),
          h(
            'n-button',
            {
              size: 'small',
              type: 'error',
              tertiary: true,
              onClick: () => handleDelete(row),
            },
            { default: () => t('common.delete') },
          ),
        ]
      })
    },
  },
])

// 表单相关
const showModal = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref<Partial<Config>>({
  id: undefined,
  name: '',
  key: '',
  value: '',
  type: '自定义',
  group: '系统配置',
  isBuiltin: false,
  status: true,
  remark: '',
})

const rules = {
  name: [
    { required: true, message: t('system.config.nameRequired'), trigger: 'blur' },
  ],
  key: [
    { required: true, message: t('system.config.keyRequired'), trigger: 'blur' },
  ],
  value: [
    { required: true, message: t('system.config.valueRequired'), trigger: 'blur' },
  ],
  type: [
    { required: true, message: t('system.config.typeRequired'), trigger: 'change' },
  ],
  group: [
    { required: true, message: t('system.config.groupRequired'), trigger: 'change' },
  ],
}

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getConfigList({
      keyword: queryParams.value.keyword,
      type: queryParams.value.type || undefined,
      group: queryParams.value.group || undefined,
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

// 获取参数分组列表
const fetchGroups = async () => {
  try {
    const response = await getConfigGroups()
    if (response.data && response.data.length > 0) {
      groupOptions.value = response.data.map((group: string) => ({
        label: group,
        value: group,
      }))
    } else {
      groupOptions.value = defaultGroupOptions.value
    }
  } catch (error) {
    // 使用默认分组选项
    groupOptions.value = defaultGroupOptions.value
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
    group: null,
  }
  pagination.value.page = 1
  fetchData()
}

// 新增参数
const handleAdd = () => {
  modalTitle.value = t('system.config.add')
  formData.value = {
    id: undefined,
    name: '',
    key: '',
    value: '',
    type: '自定义',
    group: '系统配置',
    isBuiltin: false,
    status: true,
    remark: '',
  }
  showModal.value = true
}

// 编辑参数
const handleEdit = (row: Config) => {
  modalTitle.value = t('system.config.edit')
  formData.value = { ...row }
  showModal.value = true
}

// 删除参数
const handleDelete = (row: Config) => {
  if (row.isBuiltin) {
    message.warning(t('system.config.builtinCannotDelete'))
    return
  }
  
  dialog.warning({
    title: t('common.confirmDelete'),
    content: t('system.config.confirmDeleteMsg', { name: row.name }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await deleteConfig(row.id)
        message.success(t('common.deleteSuccess'))
        fetchData()
      } catch (error: any) {
        message.error(error.message || t('common.deleteFailed'))
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
      if (formData.value.id) {
        // 更新
        await updateConfig(formData.value.id, formData.value)
        message.success(t('common.updateSuccess'))
      } else {
        // 新增
        await createConfig(formData.value)
        message.success(t('common.createSuccess'))
      }
      showModal.value = false
      fetchData()
    } catch (error: any) {
      message.error(error.message || (formData.value.id ? t('common.updateFailed') : t('common.createFailed')))
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  fetchData()
  fetchGroups()
})
</script>

<style scoped>
.config-container {
  height: 100%;
}
</style> 
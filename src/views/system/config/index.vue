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
              新增参数
            </n-button>
            <n-button @click="fetchData">
              <template #icon>
                <n-icon><refresh-outline /></n-icon>
              </template>
              刷新
            </n-button>
          </n-space>
          <n-space>
            <n-select
              v-model:value="queryParams.type"
              :options="typeOptions"
              placeholder="参数类型"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-select
              v-model:value="queryParams.group"
              :options="groupOptions"
              placeholder="参数分组"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-input
              v-model:value="queryParams.keyword"
              placeholder="请输入参数名称/键名搜索"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button @click="handleSearch">搜索</n-button>
            <n-button @click="handleReset">重置</n-button>
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
        <n-form-item label="参数名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入参数名称" />
        </n-form-item>
        <n-form-item label="参数键名" path="key">
          <n-input v-model:value="formData.key" placeholder="请输入参数键名" />
        </n-form-item>
        <n-form-item label="参数键值" path="value">
          <n-input v-model:value="formData.value" placeholder="请输入参数键值" />
        </n-form-item>
        <n-form-item label="参数类型" path="type">
          <n-select
            v-model:value="formData.type"
            :options="typeOptions"
            placeholder="请选择参数类型"
          />
        </n-form-item>
        <n-form-item label="参数分组" path="group">
          <n-select
            v-model:value="formData.group"
            :options="groupOptions"
            placeholder="请选择参数分组"
            filterable
            tag
          />
        </n-form-item>
        <n-form-item label="是否内置" path="isBuiltin">
          <n-switch v-model:value="formData.isBuiltin" :disabled="!!formData.id" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="formData.status" />
        </n-form-item>
        <n-form-item label="备注" path="remark">
          <n-input
            v-model:value="formData.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
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

const message = useMessage()
const dialog = useDialog()

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
const typeOptions = [
  { label: '系统内置', value: '系统内置' },
  { label: '自定义', value: '自定义' },
]

// 参数分组选项
const groupOptions = ref<{ label: string; value: string }[]>([
  { label: '系统配置', value: '系统配置' },
  { label: '邮件配置', value: '邮件配置' },
  { label: '短信配置', value: '短信配置' },
  { label: '文件配置', value: '文件配置' },
])

// 表格列配置
const columns: DataTableColumns<Config> = [
  {
    title: '参数名称',
    key: 'name',
  },
  {
    title: '参数键名',
    key: 'key',
  },
  {
    title: '参数键值',
    key: 'value',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '参数类型',
    key: 'type',
    render(row) {
      return h(
        'n-tag',
        {
          type: row.type === '系统内置' ? 'info' : 'success',
        },
        { default: () => row.type },
      )
    },
  },
  {
    title: '参数分组',
    key: 'group',
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        'n-tag',
        {
          type: row.status ? 'success' : 'error',
        },
        { default: () => (row.status ? '启用' : '禁用') },
      )
    },
  },
  {
    title: '备注',
    key: 'remark',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h('n-space', null, {
        default: () => [
          h(
            'n-button',
            {
              text: true,
              type: 'primary',
              onClick: () => handleEdit(row),
            },
            { default: () => '编辑' },
          ),
          h(
            'n-button',
            {
              text: true,
              type: 'error',
              onClick: () => handleDelete(row),
              disabled: row.isBuiltin, // 内置参数不可删除
            },
            { default: () => '删除' },
          ),
        ],
      })
    },
  },
]

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
    { required: true, message: '请输入参数名称', trigger: 'blur' },
  ],
  key: [
    { required: true, message: '请输入参数键名', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入参数键值', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择参数类型', trigger: 'change' },
  ],
  group: [
    { required: true, message: '请选择参数分组', trigger: 'change' },
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
      message.warning('未获取到数据')
    }
  }
  catch (error: any) {
    tableData.value = []
    pagination.value.itemCount = 0
    message.error(error.message || '获取数据失败')
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
    }
  } catch (error) {
    // 使用默认分组选项
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
  modalTitle.value = '新增参数'
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
  modalTitle.value = '编辑参数'
  formData.value = { ...row }
  showModal.value = true
}

// 删除参数
const handleDelete = (row: Config) => {
  if (row.isBuiltin) {
    message.warning('内置参数不可删除')
    return
  }
  
  dialog.warning({
    title: '确认删除',
    content: `确定要删除参数 "${row.name}" 吗？删除后不可恢复！`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteConfig(row.id)
        message.success('删除成功')
        fetchData()
      } catch (error: any) {
        message.error(error.message || '删除失败')
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
        message.success('更新成功')
      } else {
        // 新增
        await createConfig(formData.value)
        message.success('新增成功')
      }
      showModal.value = false
      fetchData()
    } catch (error: any) {
      message.error(error.message || (formData.value.id ? '更新失败' : '新增失败'))
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
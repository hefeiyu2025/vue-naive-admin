<template>
  <div class="permission-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              新增权限
            </n-button>
          </n-space>
          <n-space>
            <n-input
              v-model:value="searchText"
              placeholder="请输入权限名称搜索"
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

    <!-- 新增/编辑权限弹窗 -->
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
        <n-form-item label="权限名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入权限名称" />
        </n-form-item>
        <n-form-item label="权限编码" path="code">
          <n-input v-model:value="formData.code" placeholder="请输入权限编码" />
        </n-form-item>
        <n-form-item label="权限类型" path="type">
          <n-select
            v-model:value="formData.type"
            :options="typeOptions"
            placeholder="请选择权限类型"
          />
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
import { ref, h, onMounted, computed } from 'vue'
import { useMessage, useDialog, NSpace } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline } from '@vicons/ionicons5'
import {
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
} from '@/api/permission'
import type { Permission } from '@/api/permission'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 表格数据
const loading = ref(false)
const tableData = ref<Permission[]>([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 搜索
const searchText = ref('')

// 权限类型选项
const typeOptions = computed(() => [
  { label: t('system.menu.menu'), value: '菜单' },
  { label: t('system.menu.button'), value: '按钮' },
])

// 表格列配置
const columns = computed<DataTableColumns<Permission>>(() => [
  {
    title: t('system.permission.name'),
    key: 'name',
  },
  {
    title: t('system.permission.code'),
    key: 'code',
  },
  {
    title: t('system.permission.type'),
    key: 'type',
    render(row) {
      return h(
        'n-tag',
        {
          type: row.type === '菜单' ? 'success' : 'warning',
        },
        { default: () => row.type === '菜单' ? t('system.menu.menu') : t('system.menu.button') },
      )
    },
  },
  {
    title: t('system.permission.status'),
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
    title: t('system.permission.remark'),
    key: 'remark',
  },
  {
    title: t('system.permission.createTime'),
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

const formData = ref({
  id: 0,
  name: '',
  code: '',
  type: '',
  status: true,
  remark: '',
  createTime: '',
})

const rules = {
  name: [
    { required: true, message: t('system.permission.nameRequired'), trigger: 'blur' },
  ],
  code: [
    { required: true, message: t('system.permission.codeRequired'), trigger: 'blur' },
  ],
  type: [
    { required: true, message: t('system.permission.typeRequired'), trigger: 'change' },
  ],
}

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getPermissionList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      keyword: searchText.value
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
  searchText.value = ''
  pagination.value.page = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  modalTitle.value = t('system.permission.add')
  formData.value = {
    id: 0,
    name: '',
    code: '',
    type: '',
    status: true,
    remark: '',
    createTime: '',
  }
  showModal.value = true
}

// 编辑
const handleEdit = (row: Permission) => {
  modalTitle.value = t('system.permission.edit')
  formData.value = { ...row }
  showModal.value = true
}

// 删除
const handleDelete = async (row: Permission) => {
  try {
    await deletePermission(row.id)
    message.success(t('common.deleteSuccess'))
    fetchData()
  }
  catch (error: any) {
    message.error(error.message || t('common.deleteFailed'))
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    if (formData.value.id === 0) {
      // 新增权限
      const { id, ...createData } = formData.value
      await createPermission(createData)
      message.success(t('system.permission.createSuccess'))
    } else {
      // 编辑权限
      const { id, ...updateData } = formData.value
      await updatePermission(id, updateData)
      message.success(t('system.permission.updateSuccess'))
    }
    
    showModal.value = false
    fetchData()
  } catch (error: any) {
    message.error(error.message || t('common.operationFailed'))
  } finally {
    submitting.value = false
  }
}

// 初始化加载数据
fetchData()
</script>

<style lang="scss" scoped>
.permission-container {
  .page-card {
    :deep(.n-card__content) {
      padding: 0;
    }
  }
}
</style> 
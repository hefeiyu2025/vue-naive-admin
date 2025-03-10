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
import { ref, h } from 'vue'
import { useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline } from '@vicons/ionicons5'
import {
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
} from '@/api/permission'
import type { Permission } from '@/api/permission'

const message = useMessage()

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
const typeOptions = [
  { label: '菜单', value: '菜单' },
  { label: '按钮', value: '按钮' },
]

// 表格列配置
const columns: DataTableColumns<Permission> = [
  {
    title: '权限名称',
    key: 'name',
  },
  {
    title: '权限编码',
    key: 'code',
  },
  {
    title: '权限类型',
    key: 'type',
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
    { required: true, message: '请输入权限名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' },
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
  modalTitle.value = '新增权限'
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
  modalTitle.value = '编辑权限'
  formData.value = { ...row }
  showModal.value = true
}

// 删除
const handleDelete = async (row: Permission) => {
  try {
    await deletePermission(row.id)
    message.success('删除成功')
    fetchData()
  }
  catch (error: any) {
    message.error(error.message || '删除失败')
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
      message.success('新增权限成功')
    } else {
      // 编辑权限
      const { id, ...updateData } = formData.value
      await updatePermission(id, updateData)
      message.success('编辑权限成功')
    }
    
    showModal.value = false
    fetchData()
  } catch (error: any) {
    message.error(error.message || '操作失败')
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
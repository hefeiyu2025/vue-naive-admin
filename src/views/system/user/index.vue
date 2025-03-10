<template>
  <div class="user-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              新增用户
            </n-button>
          </n-space>
          <n-space>
            <n-input
              v-model:value="searchText"
              placeholder="请输入用户名搜索"
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

    <!-- 新增/编辑用户弹窗 -->
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
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formData.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-select
            v-model:value="formData.role"
            :options="roleOptions"
            placeholder="请选择角色"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="formData.status" />
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
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { User } from '@/api/user'

const message = useMessage()

// 表格数据
const loading = ref(false)
const tableData = ref<User[]>([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 搜索
const searchText = ref('')

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '角色',
    key: 'role',
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

// 角色选项
const roleOptions = [
  { label: '管理员', value: '管理员' },
  { label: '普通用户', value: '普通用户' },
]

// 表单相关
const showModal = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref({
  id: 0,
  username: '',
  role: '',
  status: true,
  createTime: '',
  nickname: '',
  avatar: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' },
  ],
}

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getUserList({
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
  modalTitle.value = '新增用户'
  formData.value = {
    id: 0,
    username: '',
    role: '',
    status: true,
    createTime: '',
    nickname: '',
    avatar: '',
  }
  showModal.value = true
}

// 编辑
const handleEdit = (row: User) => {
  modalTitle.value = '编辑用户'
  // 确保所有必要的字段都存在
  formData.value = { 
    ...row,
    status: row.status === undefined ? true : row.status,
    nickname: row.nickname || '',
    avatar: row.avatar || '',
  }
  showModal.value = true
}

// 删除
const handleDelete = async (row: User) => {
  try {
    await deleteUser(row.id)
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
      // 新增用户
      const { id, createTime, ...createData } = formData.value
      await createUser(createData as Omit<User, 'id'>)
      message.success('新增用户成功')
    } else {
      // 编辑用户
      const { id, ...updateData } = formData.value
      await updateUser(id, updateData)
      message.success('编辑用户成功')
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
.user-container {
  .page-card {
    :deep(.n-card__content) {
      padding: 0;
    }
  }
}
</style> 
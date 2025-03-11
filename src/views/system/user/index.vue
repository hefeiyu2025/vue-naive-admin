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
              {{ t('system.user.add') }}
            </n-button>
          </n-space>
          <n-space>
            <n-input
              v-model:value="searchText"
              :placeholder="t('common.searchPlaceholder')"
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
        <n-form-item :label="t('system.user.username')" path="username">
          <n-input v-model:value="formData.username" :placeholder="t('system.user.enterUsername')" />
        </n-form-item>
        <n-form-item :label="t('system.user.role')" path="role">
          <n-select
            v-model:value="formData.role"
            :options="roleOptions"
            :placeholder="t('system.user.selectRole')"
          />
        </n-form-item>
        <n-form-item :label="t('system.user.status')" path="status">
          <n-switch v-model:value="formData.status" />
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
import { ref, h, computed } from 'vue'
import { useMessage, NSpace } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline } from '@vicons/ionicons5'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { User } from '@/api/user'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const { t } = useI18n()

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
const columns = computed<DataTableColumns<User>>(() => [
  {
    title: t('system.user.username'),
    key: 'username',
  },
  {
    title: t('system.user.role'),
    key: 'role',
  },
  {
    title: t('system.user.status'),
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
    title: t('system.user.createTime'),
    key: 'createTime',
  },
  {
    title: t('common.action'),
    key: 'actions',
    width: 280,
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
          row.status
            ? h(
                'n-button',
                {
                  size: 'small',
                  type: 'warning',
                  tertiary: true,
                  onClick: () => handleChangeStatus(row),
                },
                { default: () => t('common.disable') },
              )
            : h(
                'n-button',
                {
                  size: 'small',
                  type: 'success',
                  tertiary: true,
                  onClick: () => handleChangeStatus(row),
                },
                { default: () => t('common.enable') },
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

// 角色选项
const roleOptions = computed(() => [
  { label: t('system.user.adminRole'), value: '管理员' },
  { label: t('system.user.normalRole'), value: '普通用户' },
])

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
    { required: true, message: t('system.user.usernameRequired'), trigger: 'blur' },
  ],
  role: [
    { required: true, message: t('system.user.roleRequired'), trigger: 'change' },
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
  modalTitle.value = t('system.user.add')
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
  modalTitle.value = t('system.user.edit')
  formData.value = {
    id: row.id,
    username: row.username,
    role: row.role,
    status: row.status || false,
    createTime: row.createTime || '',
    nickname: row.nickname || '',
    avatar: row.avatar || '',
  }
  showModal.value = true
}

// 删除
const handleDelete = async (row: User) => {
  try {
    await deleteUser(row.id)
    message.success(t('common.deleteSuccess'))
    fetchData()
  }
  catch (error: any) {
    message.error(error.message || t('common.deleteFailed'))
  }
}

// 修改状态
const handleChangeStatus = async (row: User) => {
  try {
    await updateUser(row.id, { status: !row.status })
    message.success(t('common.updateSuccess'))
    fetchData()
  } catch (error: any) {
    message.error(error.message || t('common.updateFailed'))
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
      message.success(t('common.createSuccess'))
    } else {
      // 编辑用户
      const { id, ...updateData } = formData.value
      await updateUser(id, updateData)
      message.success(t('common.updateSuccess'))
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
.user-container {
  .page-card {
    :deep(.n-card__content) {
      padding: 0;
    }
  }
}
</style> 
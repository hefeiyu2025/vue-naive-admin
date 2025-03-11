<template>
  <div class="role-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              {{ t('system.role.add') }}
            </n-button>
          </n-space>
          <n-space>
            <n-input
              v-model:value="searchText"
              :placeholder="t('system.role.search')"
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

    <!-- 新增/编辑角色弹窗 -->
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
        <n-form-item :label="t('system.role.name')" path="name">
          <n-input v-model:value="formData.name" :placeholder="t('system.role.enterName')" />
        </n-form-item>
        <n-form-item :label="t('system.role.code')" path="code">
          <n-input v-model:value="formData.code" :placeholder="t('system.role.enterCode')" />
        </n-form-item>
        <n-form-item :label="t('system.role.status')" path="status">
          <n-switch v-model:value="formData.status" />
        </n-form-item>
        <n-form-item :label="t('system.role.remark')" path="remark">
          <n-input
            v-model:value="formData.remark"
            type="textarea"
            :placeholder="t('system.role.enterRemark')"
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
import { ref, h, computed } from 'vue'
import { useMessage, NSpace } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AddOutline, SearchOutline } from '@vicons/ionicons5'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'
import type { Role } from '@/api/role'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const { t } = useI18n()

// 表格数据
const loading = ref(false)
const tableData = ref<Role[]>([])
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
const columns = computed<DataTableColumns<Role>>(() => [
  {
    title: t('system.role.name'),
    key: 'name',
  },
  {
    title: t('system.role.code'),
    key: 'code',
  },
  {
    title: t('system.role.status'),
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
    title: t('system.role.remark'),
    key: 'remark',
  },
  {
    title: t('system.role.createTime'),
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

// 表单相关
const showModal = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref({
  id: 0,
  name: '',
  code: '',
  status: true,
  remark: '',
  createTime: '',
})

const rules = {
  name: [
    { required: true, message: t('system.role.nameRequired'), trigger: 'blur' },
  ],
  code: [
    { required: true, message: t('system.role.codeRequired'), trigger: 'blur' },
  ],
}

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getRoleList({
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
  modalTitle.value = t('system.role.add')
  formData.value = {
    id: 0,
    name: '',
    code: '',
    status: true,
    remark: '',
    createTime: '',
  }
  showModal.value = true
}

// 编辑
const handleEdit = (row: Role) => {
  modalTitle.value = t('system.role.edit')
  formData.value = { ...row }
  showModal.value = true
}

// 删除
const handleDelete = async (row: Role) => {
  try {
    await deleteRole(row.id)
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
      // 新增角色
      const { id, ...createData } = formData.value
      await createRole(createData)
      message.success(t('system.role.createSuccess'))
    } else {
      // 编辑角色
      const { id, ...updateData } = formData.value
      await updateRole(id, updateData)
      message.success(t('system.role.updateSuccess'))
    }
    
    showModal.value = false
    fetchData()
  } catch (error: any) {
    message.error(error.message || t('common.operationFailed'))
  } finally {
    submitting.value = false
  }
}

// 修改状态
const handleChangeStatus = async (row: Role) => {
  try {
    await updateRole(row.id, { status: !row.status })
    message.success(t('common.updateSuccess'))
    fetchData()
  } catch (error: any) {
    message.error(error.message || t('common.updateFailed'))
  }
}

// 初始化加载数据
fetchData()
</script>

<style lang="scss" scoped>
.role-container {
  .page-card {
    :deep(.n-card__content) {
      padding: 0;
    }
  }
}
</style> 
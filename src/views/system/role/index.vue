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
              新增角色
            </n-button>
          </n-space>
          <n-space>
            <n-input
              v-model:value="searchText"
              placeholder="请输入角色名称搜索"
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
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="角色编码" path="code">
          <n-input v-model:value="formData.code" placeholder="请输入角色编码" />
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
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'
import type { Role } from '@/api/role'

const message = useMessage()

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
const columns: DataTableColumns<Role> = [
  {
    title: '角色名称',
    key: 'name',
  },
  {
    title: '角色编码',
    key: 'code',
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
  status: true,
  remark: '',
  createTime: '',
})

const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
  ],
}

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true
    const { list, total } = await getRoleList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    tableData.value = list
    pagination.value.itemCount = total
  }
  catch (error: any) {
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
  modalTitle.value = '新增角色'
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
  modalTitle.value = '编辑角色'
  formData.value = { ...row }
  showModal.value = true
}

// 删除
const handleDelete = async (row: Role) => {
  try {
    await deleteRole(row.id)
    message.success('删除成功')
    fetchData()
  }
  catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      submitting.value = true
      if (formData.value.id) {
        await updateRole(formData.value.id, formData.value)
        message.success('更新成功')
      }
      else {
        await createRole(formData.value)
        message.success('创建成功')
      }
      showModal.value = false
      fetchData()
    }
    catch (error: any) {
      message.error(error.message || '操作失败')
    }
    finally {
      submitting.value = false
    }
  })
}

// 初始化
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
<template>
  <div class="department-container">
    <n-grid :cols="24" :x-gap="16">
      <!-- 左侧部门树 -->
      <n-grid-item :span="6">
        <n-card :bordered="false" class="page-card">
          <template #header>
            <n-space vertical>
              <n-space>
                <n-button type="primary" @click="handleAdd()">
                  <template #icon>
                    <n-icon><add-outline /></n-icon>
                  </template>
                  {{ t('system.department.add') }}
                </n-button>
                <n-button @click="fetchData">
                  <template #icon>
                    <n-icon><refresh-outline /></n-icon>
                  </template>
                  {{ t('common.refresh') }}
                </n-button>
              </n-space>
              <n-input-group>
                <n-input
                  v-model:value="searchText"
                  :placeholder="t('system.department.search')"
                  clearable
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <n-icon><search-outline /></n-icon>
                  </template>
                </n-input>
                <n-button type="primary" @click="handleSearch">{{ t('common.search') }}</n-button>
                <n-button @click="handleReset">{{ t('common.reset') }}</n-button>
              </n-input-group>
            </n-space>
          </template>

          <n-tree
            v-if="!loading && treeData.length > 0"
            :data="treeData"
            block-line
            :render-label="renderLabel"
            :expand-on-click="false"
            :default-expanded-keys="expandedKeys"
            key-field="id"
            :selectable="true"
            @update:selected-keys="handleSelectDepartment"
          />
          <n-empty v-else-if="!loading && treeData.length === 0" :description="t('common.noData')" />
          <n-spin v-else />
        </n-card>
      </n-grid-item>

      <!-- 右侧部门详情 -->
      <n-grid-item :span="18">
        <n-card :bordered="false" class="page-card">
          <template #header>
            <n-space justify="space-between">
              <span>{{ selectedDepartment ? selectedDepartment.name : t('system.department.details') }}</span>
              <n-space v-if="selectedDepartment">
                <n-button type="primary" @click="handleAdd(undefined, selectedDepartment.id)">
                  <template #icon>
                    <n-icon><add-outline /></n-icon>
                  </template>
                  {{ t('system.department.addSubDept') }}
                </n-button>
                <n-button type="primary" @click="handleEdit(selectedDepartment)">
                  <template #icon>
                    <n-icon><create-outline /></n-icon>
                  </template>
                  {{ t('system.department.edit') }}
                </n-button>
                <n-button type="error" @click="handleDelete(selectedDepartment)">
                  <template #icon>
                    <n-icon><trash-outline /></n-icon>
                  </template>
                  {{ t('system.department.delete') }}
                </n-button>
              </n-space>
            </n-space>
          </template>

          <div v-if="selectedDepartment" class="department-details">
            <n-descriptions bordered>
              <n-descriptions-item :label="t('system.department.name')">
                {{ selectedDepartment.name }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.code')">
                {{ selectedDepartment.code }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.leader')">
                {{ selectedDepartment.leader || '-' }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.phone')">
                {{ selectedDepartment.phone || '-' }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.email')">
                {{ selectedDepartment.email || '-' }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.status')">
                <n-tag :type="selectedDepartment.status ? 'success' : 'error'">
                  {{ selectedDepartment.status ? t('system.department.enable') : t('system.department.disable') }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item :label="t('system.department.orderNum')">
                {{ selectedDepartment.orderNum }}
              </n-descriptions-item>
            </n-descriptions>

            <div class="sub-departments" v-if="selectedDepartment.children && selectedDepartment.children.length > 0">
              <h3>{{ t('system.department.subDepartments') }}</h3>
              <n-data-table
                :columns="columns"
                :data="selectedDepartment.children"
                :pagination="{ pageSize: 5 }"
              />
            </div>
          </div>
          <n-empty v-else :description="t('system.department.selectTip')" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 新增/编辑部门弹窗 -->
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
        <n-form-item :label="t('system.department.parent')" path="parentId">
          <n-tree-select
            v-model:value="formData.parentId"
            :options="parentOptions"
            :placeholder="t('system.department.selectParent')"
            clearable
            :default-value="0"
          />
        </n-form-item>
        <n-form-item :label="t('system.department.name')" path="name">
          <n-input v-model:value="formData.name" :placeholder="t('system.department.enterName')" />
        </n-form-item>
        <n-form-item :label="t('system.department.code')" path="code">
          <n-input v-model:value="formData.code" :placeholder="t('system.department.enterCode')" />
        </n-form-item>
        <n-form-item :label="t('system.department.leader')" path="leader">
          <n-input v-model:value="formData.leader" :placeholder="t('system.department.enterLeader')" />
        </n-form-item>
        <n-form-item :label="t('system.department.phone')" path="phone">
          <n-input v-model:value="formData.phone" :placeholder="t('system.department.enterPhone')" />
        </n-form-item>
        <n-form-item :label="t('system.department.email')" path="email">
          <n-input v-model:value="formData.email" :placeholder="t('system.department.enterEmail')" />
        </n-form-item>
        <n-form-item :label="t('system.department.orderNum')" path="orderNum">
          <n-input-number v-model:value="formData.orderNum" :min="0" />
        </n-form-item>
        <n-form-item :label="t('system.department.status')" path="status">
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
import { ref, h, onMounted, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import type { FormInst, TreeOption, DataTableColumns } from 'naive-ui'
import { 
  AddOutline, 
  SearchOutline, 
  RefreshOutline,
  CreateOutline,
  TrashOutline
} from '@vicons/ionicons5'
import {
  getDepartmentTree,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/api/department'
import type { Department } from '@/api/department'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 树形数据
const loading = ref(false)
const treeData = ref<Department[]>([])
const expandedKeys = ref<number[]>([])
const selectedDepartment = ref<Department | null>(null)

// 表格列定义
const columns = computed<DataTableColumns<Department>>(() => [
  {
    title: t('system.department.name'),
    key: 'name',
  },
  {
    title: t('system.department.code'),
    key: 'code',
  },
  {
    title: t('system.department.leader'),
    key: 'leader',
    render: (row) => row.leader || '-',
  },
  {
    title: t('system.department.status'),
    key: 'status',
    render: (row) => h(
      'n-tag',
      { type: row.status ? 'success' : 'error' },
      { default: () => row.status ? t('system.department.enable') : t('system.department.disable') }
    ),
  },
  {
    title: t('system.department.actions'),
    key: 'actions',
    render: (row) => h(
      'n-space',
      null,
      {
        default: () => [
          h(
            'n-button',
            {
              text: true,
              type: 'primary',
              onClick: () => handleEdit(row),
            },
            { default: () => h('n-icon', null, { default: () => h(CreateOutline) }) }
          ),
          h(
            'n-button',
            {
              text: true,
              type: 'error',
              onClick: () => handleDelete(row),
            },
            { default: () => h('n-icon', null, { default: () => h(TrashOutline) }) }
          ),
        ],
      }
    ),
  },
])

// 搜索
const searchText = ref('')

// 表单相关
const showModal = ref(false)
const modalTitle = ref('')
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref<Partial<Department>>({
  id: undefined,
  parentId: 0,
  name: '',
  code: '',
  leader: '',
  phone: '',
  email: '',
  status: true,
  orderNum: 0,
})

const rules = {
  name: [
    { required: true, message: t('system.department.enterName'), trigger: 'blur' },
  ],
  code: [
    { required: true, message: t('system.department.enterCode'), trigger: 'blur' },
  ],
}

// 上级部门选项
const parentOptions = computed(() => {
  const rootOption = {
    key: 0,
    label: t('system.department.topDept'),
    value: 0,
  }
  
  const convertToTreeOptions = (departments: Department[]): TreeOption[] => {
    return departments.map(dept => ({
      key: dept.id,
      label: dept.name,
      value: dept.id,
      disabled: formData.value.id === dept.id, // 禁止选择自己作为父级
      children: dept.children ? convertToTreeOptions(dept.children) : undefined
    }))
  }
  
  return [rootOption, ...convertToTreeOptions(treeData.value)]
})

// 获取部门树形数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getDepartmentTree({
      keyword: searchText.value
    })
    
    // 确保响应数据格式正确
    treeData.value = response.data || []
    
    // 展开所有节点
    const collectKeys = (departments: Department[]): number[] => {
      let keys: number[] = []
      departments.forEach(dept => {
        keys.push(dept.id)
        if (dept.children && dept.children.length > 0) {
          keys = [...keys, ...collectKeys(dept.children)]
        }
      })
      return keys
    }
    
    expandedKeys.value = collectKeys(treeData.value)
    
    if (!response.data || response.data.length === 0) {
      message.warning(t('common.noData'))
    }
  }
  catch (error: any) {
    treeData.value = []
    message.error(error.message || t('common.fetchFailed'))
  }
  finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置
const handleReset = () => {
  searchText.value = ''
  fetchData()
}

// 选择部门
const handleSelectDepartment = (keys: number[]) => {
  if (keys.length === 0) {
    selectedDepartment.value = null
    return
  }
  
  const findDepartment = (departments: Department[], id: number): Department | null => {
    for (const dept of departments) {
      if (dept.id === id) {
        return dept
      }
      if (dept.children && dept.children.length > 0) {
        const found = findDepartment(dept.children, id)
        if (found) {
          return found
        }
      }
    }
    return null
  }
  
  selectedDepartment.value = findDepartment(treeData.value, keys[0])
}

// 新增部门
const handleAdd = (_e?: MouseEvent, parentId?: number) => {
  modalTitle.value = t('system.department.add')
  // 如果没有指定父部门ID，且当前有选中的部门，则使用选中的部门作为父部门
  const pid = parentId !== undefined ? parentId : 
              (selectedDepartment.value ? selectedDepartment.value.id : 0)
  
  formData.value = {
    id: undefined,
    parentId: pid,
    name: '',
    code: '',
    leader: '',
    phone: '',
    email: '',
    status: true,
    orderNum: 0,
  }
  showModal.value = true
}

// 编辑部门
const handleEdit = (row: Department) => {
  modalTitle.value = t('system.department.edit')
  formData.value = { ...row }
  showModal.value = true
}

// 删除部门
const handleDelete = (row: Department) => {
  dialog.warning({
    title: t('common.confirmDelete'),
    content: t('system.department.confirmDeleteMsg', { name: row.name }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await deleteDepartment(row.id)
        message.success(t('common.deleteSuccess'))
        fetchData()
        if (selectedDepartment.value && selectedDepartment.value.id === row.id) {
          selectedDepartment.value = null
        }
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
        await updateDepartment(formData.value.id, formData.value)
        message.success(t('common.updateSuccess'))
      } else {
        // 新增
        await createDepartment(formData.value)
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

// 渲染树节点
const renderLabel = (node: { option: TreeOption }) => {
  const option = node.option as unknown as Department
  return h('div', { class: 'tree-node' }, [
    h('span', { class: 'node-label' }, option.name),
    h('div', { class: 'node-actions' }, [
      h(
        'n-button',
        {
          text: true,
          type: 'primary',
          style: 'margin-right: 8px;',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            handleAdd(e, option.id)
          },
        },
        { default: () => h('n-icon', null, { default: () => h(AddOutline) }) }
      ),
      h(
        'n-button',
        {
          text: true,
          type: 'primary',
          style: 'margin-right: 8px;',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            handleEdit(option)
          },
        },
        { default: () => h('n-icon', null, { default: () => h(CreateOutline) }) }
      ),
      h(
        'n-button',
        {
          text: true,
          type: 'error',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            handleDelete(option)
          },
        },
        { default: () => h('n-icon', null, { default: () => h(TrashOutline) }) }
      ),
    ]),
  ])
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.department-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 4px 0;
  flex-wrap: wrap;
}

.node-label {
  font-weight: bold;
}

.node-actions {
  margin-left: auto;
}

.department-details {
  margin-top: 16px;
}

.sub-departments {
  margin-top: 24px;
}

.sub-departments h3 {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .node-actions {
    margin-left: 0;
    margin-top: 4px;
    width: 100%;
  }
}
</style> 
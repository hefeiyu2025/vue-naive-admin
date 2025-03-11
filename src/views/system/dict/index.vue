<template>
  <div class="dict-container">
    <n-grid :cols="24" :x-gap="16">
      <!-- 左侧字典类型 -->
      <n-grid-item :span="9">
        <n-card :bordered="false" class="page-card">
          <template #header>
            <n-space justify="space-between">
              <span>字典类型</span>
              <n-space>
                <n-button type="primary" @click="handleAddType">
                  <template #icon>
                    <n-icon><add-outline /></n-icon>
                  </template>
                  {{ t('system.dict.type.add') }}
                </n-button>
                <n-button @click="fetchTypeData">
                  <template #icon>
                    <n-icon><refresh-outline /></n-icon>
                  </template>
                  {{ t('common.refresh') }}
                </n-button>
              </n-space>
            </n-space>
          </template>

          <!-- 字典类型搜索 -->
          <n-input-group style="margin-bottom: 16px">
            <n-input
              v-model:value="typeQueryParams.keyword"
              :placeholder="t('system.dict.type.search')"
              clearable
              @keyup.enter="handleTypeSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button type="primary" @click="handleTypeSearch">{{ t('common.search') }}</n-button>
            <n-button @click="handleTypeReset">{{ t('common.reset') }}</n-button>
          </n-input-group>

          <!-- 字典类型表格 -->
          <n-data-table
            :columns="typeColumns"
            :data="typeData"
            :loading="typeLoading"
            :pagination="typePagination"
            @update:page="handleTypePageChange"
            :single-line="false"
            :row-props="typeRowProps"
          />
        </n-card>
      </n-grid-item>

      <!-- 右侧字典数据 -->
      <n-grid-item :span="15">
        <n-card :bordered="false" class="page-card">
          <template #header>
            <n-space justify="space-between">
              <span>{{ selectedDictType ? `${selectedDictType.name}(${selectedDictType.type})` : t('system.dict.data.title') }}</span>
              <n-space v-if="selectedDictType">
                <n-button type="primary" @click="handleAddData">
                  <template #icon>
                    <n-icon><add-outline /></n-icon>
                  </template>
                  {{ t('system.dict.data.add') }}
                </n-button>
                <n-button @click="fetchDataList">
                  <template #icon>
                    <n-icon><refresh-outline /></n-icon>
                  </template>
                  {{ t('common.refresh') }}
                </n-button>
              </n-space>
            </n-space>
          </template>

          <div v-if="selectedDictType">
            <!-- 字典数据搜索 -->
            <n-input-group style="margin-bottom: 16px">
              <n-input
                v-model:value="dataQueryParams.keyword"
                :placeholder="t('system.dict.data.search')"
                clearable
                @keyup.enter="handleDataSearch"
              >
                <template #prefix>
                  <n-icon><search-outline /></n-icon>
                </template>
              </n-input>
              <n-button type="primary" @click="handleDataSearch">{{ t('common.search') }}</n-button>
              <n-button @click="handleDataReset">{{ t('common.reset') }}</n-button>
            </n-input-group>

            <!-- 字典数据表格 -->
            <n-data-table
              :columns="dataColumns"
              :data="dataData"
              :loading="dataLoading"
              :pagination="dataPagination"
              @update:page="handleDataPageChange"
            />
          </div>
          <n-empty v-else :description="t('system.dict.data.selectTip')" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 字典类型弹窗 -->
    <n-modal
      v-model:show="showTypeModal"
      :title="typeModalTitle"
      preset="card"
      :style="{ width: '600px' }"
    >
      <n-form
        ref="typeFormRef"
        :model="typeFormData"
        :rules="typeRules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('system.dict.type.name')" path="name">
          <n-input v-model:value="typeFormData.name" :placeholder="t('system.dict.type.enterName')" />
        </n-form-item>
        <n-form-item :label="t('system.dict.type.type')" path="type">
          <n-input v-model:value="typeFormData.type" :placeholder="t('system.dict.type.enterType')" />
        </n-form-item>
        <n-form-item :label="t('system.dict.type.status')" path="status">
          <n-switch v-model:value="typeFormData.status" />
        </n-form-item>
        <n-form-item :label="t('system.dict.type.remark')" path="remark">
          <n-input
            v-model:value="typeFormData.remark"
            type="textarea"
            :placeholder="t('system.dict.type.enterRemark')"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showTypeModal = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" :loading="typeSubmitting" @click="handleTypeSubmit">
            {{ t('common.confirm') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 字典数据弹窗 -->
    <n-modal
      v-model:show="showDataModal"
      :title="dataModalTitle"
      preset="card"
      :style="{ width: '600px' }"
    >
      <n-form
        ref="dataFormRef"
        :model="dataFormData"
        :rules="dataRules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('system.dict.data.dictType')" path="dictType">
          <n-input v-model:value="dataFormData.dictType" disabled />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.label')" path="label">
          <n-input v-model:value="dataFormData.label" :placeholder="t('system.dict.data.enterLabel')" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.value')" path="value">
          <n-input v-model:value="dataFormData.value" :placeholder="t('system.dict.data.enterValue')" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.cssClass')" path="cssClass">
          <n-input v-model:value="dataFormData.cssClass" :placeholder="t('system.dict.data.enterCssClass')" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.listClass')" path="listClass">
          <n-select
            v-model:value="dataFormData.listClass"
            :options="listClassOptions"
            :placeholder="t('system.dict.data.selectListClass')"
            clearable
          />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.isDefault')" path="isDefault">
          <n-switch v-model:value="dataFormData.isDefault" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.orderNum')" path="orderNum">
          <n-input-number v-model:value="dataFormData.orderNum" :min="0" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.status')" path="status">
          <n-switch v-model:value="dataFormData.status" />
        </n-form-item>
        <n-form-item :label="t('system.dict.data.remark')" path="remark">
          <n-input
            v-model:value="dataFormData.remark"
            type="textarea"
            :placeholder="t('system.dict.data.enterRemark')"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDataModal = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" :loading="dataSubmitting" @click="handleDataSubmit">
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
  getDictTypeList,
  createDictType,
  updateDictType,
  deleteDictType,
  getDictDataList,
  createDictData,
  updateDictData,
  deleteDictData,
} from '@/api/dict'
import type { DictType, DictData } from '@/api/dict'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 当前选中的字典类型
const selectedDictType = ref<DictType | null>(null)

// ==================== 字典类型相关 ====================
// 字典类型表格数据
const typeLoading = ref(false)
const typeData = ref<DictType[]>([])
const typePagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 字典类型查询参数
const typeQueryParams = ref({
  keyword: '',
  status: undefined as boolean | undefined,
})

// 字典类型行属性
const typeRowProps = (row: DictType) => {
  return {
    style: selectedDictType.value && selectedDictType.value.id === row.id
      ? 'background-color: var(--n-primary-color-hover);color: var(--n-primary-color);cursor: pointer;'
      : 'cursor: pointer;',
    onClick: () => {
      if (selectedDictType.value && selectedDictType.value.id === row.id) {
        selectedDictType.value = null
      } else {
        selectedDictType.value = row
        // 加载字典数据
        dataPagination.value.page = 1
        dataQueryParams.value.keyword = ''
        fetchDataList()
      }
    }
  }
}

// 字典类型表格列配置
const typeColumns = computed<DataTableColumns<DictType>>(() => [
  {
    title: t('system.dict.type.name'),
    key: 'name',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('system.dict.type.type'),
    key: 'type',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('system.dict.type.status'),
    key: 'status',
    width: 100,
    align: 'center',
    render: (row) => h(
      'n-tag',
      { type: row.status ? 'success' : 'error' },
      { default: () => row.status ? t('system.dict.type.enable') : t('system.dict.type.disable') }
    ),
  },
  {
    title: t('system.dict.type.actions'),
    key: 'actions',
    width: 130,
    align: 'center',
    render: (row) => h(
      'n-space',
      { justify: 'center', align: 'center' },
      {
        default: () => [
          h(
            'n-button',
            {
              size: 'small',
              quaternary: true,
              type: 'primary',
              onClick: (e) => {
                e.stopPropagation()
                handleEditType(row)
              },
            },
            { default: () => '编辑' }
          ),
          h(
            'n-button',
            {
              size: 'small',
              quaternary: true,
              type: 'error',
              onClick: (e) => {
                e.stopPropagation()
                handleDeleteType(row)
              },
            },
            { default: () => '删除' }
          ),
        ],
      }
    ),
  },
])

// 字典类型表单
const showTypeModal = ref(false)
const typeModalTitle = ref('')
const typeFormRef = ref<FormInst | null>(null)
const typeSubmitting = ref(false)
const typeFormData = ref<Partial<DictType>>({
  name: '',
  type: '',
  status: true,
  remark: '',
})

// 字典类型表单校验规则
const typeRules = {
  name: [
    { required: true, message: t('system.dict.type.nameRequired'), trigger: 'blur' },
  ],
  type: [
    { required: true, message: t('system.dict.type.typeRequired'), trigger: 'blur' },
  ],
}

// 获取字典类型列表
const fetchTypeData = async () => {
  try {
    typeLoading.value = true
    const response = await getDictTypeList({
      page: typePagination.value.page,
      pageSize: typePagination.value.pageSize,
      ...typeQueryParams.value,
    })
    
    typeData.value = response.data.list
    typePagination.value.itemCount = response.data.total
  } catch (error: any) {
    message.error(error.message || t('common.fetchFailed'))
  } finally {
    typeLoading.value = false
  }
}

// 字典类型分页变化
const handleTypePageChange = (page: number) => {
  typePagination.value.page = page
  fetchTypeData()
}

// 字典类型搜索
const handleTypeSearch = () => {
  typePagination.value.page = 1
  fetchTypeData()
}

// 字典类型重置
const handleTypeReset = () => {
  typeQueryParams.value.keyword = ''
  typeQueryParams.value.status = undefined
  typePagination.value.page = 1
  fetchTypeData()
}

// 新增字典类型
const handleAddType = () => {
  typeModalTitle.value = t('system.dict.type.add')
  typeFormData.value = {
    name: '',
    type: '',
    status: true,
    remark: '',
  }
  showTypeModal.value = true
}

// 编辑字典类型
const handleEditType = (row: DictType) => {
  typeModalTitle.value = t('system.dict.type.edit')
  typeFormData.value = { ...row }
  showTypeModal.value = true
}

// 删除字典类型
const handleDeleteType = (row: DictType) => {
  dialog.warning({
    title: t('common.confirmDelete'),
    content: t('system.dict.type.confirmDeleteMsg', { name: row.name }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await deleteDictType(row.id)
        message.success(t('common.deleteSuccess'))
        fetchTypeData()
        if (selectedDictType.value && selectedDictType.value.id === row.id) {
          selectedDictType.value = null
        }
      } catch (error: any) {
        message.error(error.message || t('common.deleteFailed'))
      }
    }
  })
}

// 提交字典类型表单
const handleTypeSubmit = () => {
  typeFormRef.value?.validate(async (errors) => {
    if (errors) return
    
    typeSubmitting.value = true
    try {
      if (typeFormData.value.id) {
        // 更新
        await updateDictType(typeFormData.value.id, typeFormData.value)
        message.success(t('common.updateSuccess'))
      } else {
        // 新增
        await createDictType(typeFormData.value)
        message.success(t('common.createSuccess'))
      }
      showTypeModal.value = false
      fetchTypeData()
    } catch (error: any) {
      message.error(error.message || (typeFormData.value.id ? t('common.updateFailed') : t('common.createFailed')))
    } finally {
      typeSubmitting.value = false
    }
  })
}

// ==================== 字典数据相关 ====================
// 字典数据表格数据
const dataLoading = ref(false)
const dataData = ref<DictData[]>([])
const dataPagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 字典数据查询参数
const dataQueryParams = ref({
  keyword: '',
  status: undefined as boolean | undefined,
})

// 字典数据表格列配置
const dataColumns = computed<DataTableColumns<DictData>>(() => [
  {
    title: t('system.dict.data.label'),
    key: 'label',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('system.dict.data.value'),
    key: 'value',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('system.dict.data.listClass'),
    key: 'listClass',
    width: 120,
    align: 'center',
    render: (row) => {
      if (!row.listClass) return null
      return h(
        'n-tag',
        { type: row.listClass as 'default' | 'success' | 'warning' | 'error' | 'info' },
        { default: () => row.label }
      )
    },
  },
  {
    title: t('system.dict.data.isDefault'),
    key: 'isDefault',
    width: 100,
    align: 'center',
    render: (row) => h(
      'n-tag',
      { type: row.isDefault ? 'success' : 'default' },
      { default: () => row.isDefault ? t('common.yes') : t('common.no') }
    ),
  },
  {
    title: t('system.dict.data.status'),
    key: 'status',
    width: 100,
    align: 'center',
    render: (row) => h(
      'n-tag',
      { type: row.status ? 'success' : 'error' },
      { default: () => row.status ? t('system.dict.data.enable') : t('system.dict.data.disable') }
    ),
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
              onClick: () => handleEditData(row),
            },
            { default: () => t('common.edit') },
          ),
          h(
            'n-button',
            {
              size: 'small',
              type: 'error',
              tertiary: true,
              onClick: () => handleDeleteData(row),
            },
            { default: () => t('common.delete') },
          ),
        ]
      })
    },
  },
])

// 字典数据表单
const showDataModal = ref(false)
const dataModalTitle = ref('')
const dataFormRef = ref<FormInst | null>(null)
const dataSubmitting = ref(false)
const dataFormData = ref<Partial<DictData>>({
  dictType: '',
  label: '',
  value: '',
  cssClass: '',
  listClass: '',
  isDefault: false,
  orderNum: 0,
  status: true,
  remark: '',
})

// 字典数据表单校验规则
const dataRules = {
  label: [
    { required: true, message: t('system.dict.data.labelRequired'), trigger: 'blur' },
  ],
  value: [
    { required: true, message: t('system.dict.data.valueRequired'), trigger: 'blur' },
  ],
}

// 回显样式选项
const listClassOptions = [
  { label: t('system.dict.data.default'), value: 'default' },
  { label: t('system.dict.data.primary'), value: 'primary' },
  { label: t('system.dict.data.success'), value: 'success' },
  { label: t('system.dict.data.warning'), value: 'warning' },
  { label: t('system.dict.data.error'), value: 'error' },
  { label: t('system.dict.data.info'), value: 'info' },
]

// 获取字典数据列表
const fetchDataList = async () => {
  if (!selectedDictType.value) {
    dataData.value = []
    dataPagination.value.itemCount = 0
    return
  }
  
  try {
    dataLoading.value = true
    const response = await getDictDataList({
      dictType: selectedDictType.value.type,
      page: dataPagination.value.page,
      pageSize: dataPagination.value.pageSize,
      ...dataQueryParams.value,
    })
    
    dataData.value = response.data.list
    dataPagination.value.itemCount = response.data.total
  } catch (error: any) {
    message.error(error.message || t('common.fetchFailed'))
    dataData.value = []
    dataPagination.value.itemCount = 0
  } finally {
    dataLoading.value = false
  }
}

// 字典数据分页变化
const handleDataPageChange = (page: number) => {
  dataPagination.value.page = page
  fetchDataList()
}

// 字典数据搜索
const handleDataSearch = () => {
  dataPagination.value.page = 1
  fetchDataList()
}

// 字典数据重置
const handleDataReset = () => {
  dataQueryParams.value.keyword = ''
  dataQueryParams.value.status = undefined
  dataPagination.value.page = 1
  fetchDataList()
}

// 新增字典数据
const handleAddData = () => {
  if (!selectedDictType.value) return
  
  dataModalTitle.value = t('system.dict.data.add')
  dataFormData.value = {
    dictType: selectedDictType.value.type,
    label: '',
    value: '',
    cssClass: '',
    listClass: '',
    isDefault: false,
    orderNum: 0,
    status: true,
    remark: '',
  }
  showDataModal.value = true
}

// 编辑字典数据
const handleEditData = (row: DictData) => {
  dataModalTitle.value = t('system.dict.data.edit')
  dataFormData.value = { ...row }
  showDataModal.value = true
}

// 删除字典数据
const handleDeleteData = (row: DictData) => {
  dialog.warning({
    title: t('common.confirmDelete'),
    content: t('system.dict.data.confirmDeleteMsg', { label: row.label }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await deleteDictData(row.id)
        message.success(t('common.deleteSuccess'))
        fetchDataList()
      } catch (error: any) {
        message.error(error.message || t('common.deleteFailed'))
      }
    }
  })
}

// 提交字典数据表单
const handleDataSubmit = () => {
  dataFormRef.value?.validate(async (errors) => {
    if (errors) return
    
    dataSubmitting.value = true
    try {
      if (dataFormData.value.id) {
        // 更新
        await updateDictData(dataFormData.value.id, dataFormData.value)
        message.success(t('common.updateSuccess'))
      } else {
        // 新增
        await createDictData(dataFormData.value)
        message.success(t('common.createSuccess'))
      }
      showDataModal.value = false
      fetchDataList()
    } catch (error: any) {
      message.error(error.message || (dataFormData.value.id ? t('common.updateFailed') : t('common.createFailed')))
    } finally {
      dataSubmitting.value = false
    }
  })
}

onMounted(() => {
  fetchTypeData()
})
</script>

<style scoped>
.dict-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-card {
  margin-bottom: 16px;
}

.department-details {
  margin-top: 16px;
}
</style> 
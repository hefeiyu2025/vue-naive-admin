<template>
  <div class="menu-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><add-outline /></n-icon>
              </template>
              新增菜单
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
              placeholder="菜单类型"
              clearable
              style="width: 120px"
              @update:value="handleSearch"
            />
            <n-input
              v-model:value="queryParams.keyword"
              placeholder="请输入菜单名称搜索"
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
        :pagination="false"
        :row-key="(row) => row.id"
        :children-key="'children'"
        :indent="20"
        default-expand-all
      />
    </n-card>

    <!-- 新增/编辑菜单弹窗 -->
    <n-modal
      v-model:show="showModal"
      :title="modalTitle"
      preset="card"
      :style="{ width: '650px' }"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="上级菜单" path="parentId">
          <n-tree-select
            v-model:value="formData.parentId"
            :options="parentOptions"
            placeholder="请选择上级菜单"
            clearable
            :default-value="0"
          />
        </n-form-item>
        <n-form-item label="菜单类型" path="type">
          <n-radio-group v-model:value="formData.type" @update:value="handleTypeChange">
            <n-space>
              <n-radio value="目录">目录</n-radio>
              <n-radio value="菜单">菜单</n-radio>
              <n-radio value="按钮">按钮</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="菜单名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入菜单名称" />
        </n-form-item>
        <n-form-item v-if="formData.type !== '按钮'" label="菜单图标" path="icon">
          <n-input v-model:value="formData.icon" placeholder="请选择图标">
            <template #suffix>
              <n-button text @click="showIconPicker = true">
                <n-icon>
                  <component :is="formData.icon || 'menu-outline'" />
                </n-icon>
              </n-button>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item v-if="formData.type === '目录' || formData.type === '菜单'" label="路由路径" path="path">
          <n-input v-model:value="formData.path" placeholder="请输入路由路径" />
        </n-form-item>
        <n-form-item v-if="formData.type === '菜单'" label="组件路径" path="component">
          <n-input v-model:value="formData.component" placeholder="请输入组件路径" />
        </n-form-item>
        <n-form-item v-if="formData.type === '目录'" label="重定向" path="redirect">
          <n-input v-model:value="formData.redirect" placeholder="请输入重定向路径" />
        </n-form-item>
        <n-form-item v-if="formData.type === '按钮'" label="权限标识" path="permission">
          <n-input v-model:value="formData.permission" placeholder="请输入权限标识" />
        </n-form-item>
        <n-form-item label="排序号" path="orderNum">
          <n-input-number v-model:value="formData.orderNum" :min="0" />
        </n-form-item>
        <n-form-item v-if="formData.type !== '按钮'" label="是否隐藏" path="hidden">
          <n-switch v-model:value="formData.hidden" />
        </n-form-item>
        <n-form-item v-if="formData.type === '菜单'" label="是否缓存" path="keepAlive">
          <n-switch v-model:value="formData.keepAlive" />
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

    <!-- 图标选择器 -->
    <n-modal v-model:show="showIconPicker" title="选择图标" preset="card" style="width: 650px">
      <div class="icon-grid">
        <div
          v-for="icon in iconList"
          :key="icon"
          class="icon-item"
          @click="selectIcon(icon)"
        >
          <n-icon :size="24">
            <component :is="icon" />
          </n-icon>
          <div class="icon-name">{{ icon }}</div>
        </div>
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showIconPicker = false">取消</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, onMounted, computed } from 'vue'
import { useMessage, useDialog, NSpace } from 'naive-ui'
import type { DataTableColumns, FormInst, TreeOption } from 'naive-ui'
import { AddOutline, SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  getIconList,
} from '@/api/menu'
import type { Menu } from '@/api/menu'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

// 表格数据
const loading = ref(false)
const tableData = ref<Menu[]>([])

// 查询参数
const queryParams = ref({
  keyword: '',
  type: null as string | null,
})

// 菜单类型选项
const typeOptions = [
  { label: '目录', value: '目录' },
  { label: '菜单', value: '菜单' },
  { label: '按钮', value: '按钮' },
]

// 表格列配置
const columns = computed<DataTableColumns<Menu>>(() => [
  {
    title: t('system.menu.name'),
    key: 'name',
    width: 220,
  },
  {
    title: t('system.menu.icon'),
    key: 'icon',
    width: 80,
    render(row) {
      return row.icon ? h('n-icon', null, {
        default: () => h('component', { is: row.icon })
      }) : null
    }
  },
  {
    title: t('system.menu.orderNum'),
    key: 'orderNum',
    width: 80,
  },
  {
    title: t('system.menu.permission'),
    key: 'permission',
    width: 180,
  },
  {
    title: t('system.menu.path'),
    key: 'path',
    width: 180,
  },
  {
    title: t('system.menu.component'),
    key: 'component',
    width: 180,
  },
  {
    title: t('system.menu.type'),
    key: 'type',
    width: 80,
    render(row) {
      const typeMap = {
        '目录': { type: 'info', text: t('system.menu.directory') },
        '菜单': { type: 'success', text: t('system.menu.menu') },
        '按钮': { type: 'warning', text: t('system.menu.button') },
      }
      const type = typeMap[row.type as keyof typeof typeMap] || { type: 'default', text: row.type }
      return h('n-tag', { type: type.type, size: 'small' }, { default: () => type.text })
    }
  },
  {
    title: t('system.menu.status'),
    key: 'status',
    width: 80,
    render(row) {
      return h(
        'n-tag',
        {
          type: row.status ? 'success' : 'error',
          size: 'small',
        },
        { default: () => (row.status ? t('common.enable') : t('common.disable')) },
      )
    }
  },
  {
    title: t('system.menu.createTime'),
    key: 'createTime',
    width: 160,
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

const formData = ref<Partial<Menu>>({
  id: undefined,
  parentId: 0,
  name: '',
  icon: '',
  path: '',
  component: '',
  redirect: '',
  type: '菜单',
  permission: '',
  orderNum: 0,
  hidden: false,
  keepAlive: false,
  status: true,
})

const rules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' },
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    { validator: (_rule: any, value: string) => {
        if (formData.value.type === '目录' || formData.value.type === '菜单') {
          return !!value || new Error('路由路径不能为空')
        }
        return true
      }, trigger: 'blur' 
    }
  ],
  component: [
    { validator: (_rule: any, value: string) => {
        if (formData.value.type === '菜单') {
          return !!value || new Error('组件路径不能为空')
        }
        return true
      }, trigger: 'blur' 
    }
  ],
  permission: [
    { validator: (_rule: any, value: string) => {
        if (formData.value.type === '按钮') {
          return !!value || new Error('权限标识不能为空')
        }
        return true
      }, trigger: 'blur' 
    }
  ],
}

// 上级菜单选项
const parentOptions = computed(() => {
  const rootOption = {
    key: 0,
    label: '顶级菜单',
    value: 0,
  }
  
  const convertToTreeOptions = (menus: Menu[]): TreeOption[] => {
    return menus
      .filter(menu => menu.type !== '按钮') // 按钮不能作为父级
      .map(menu => ({
        key: menu.id,
        label: menu.name,
        value: menu.id,
        disabled: formData.value.id === menu.id, // 禁止选择自己作为父级
        children: menu.children ? convertToTreeOptions(menu.children) : undefined
      }))
  }
  
  return [rootOption, ...convertToTreeOptions(tableData.value)]
})

// 图标选择器
const showIconPicker = ref(false)
const iconList = ref<string[]>([
  'home-outline', 'settings-outline', 'people-outline', 'person-outline',
  'document-text-outline', 'documents-outline', 'list-outline', 'grid-outline',
  'apps-outline', 'menu-outline', 'options-outline', 'build-outline',
  'key-outline', 'lock-closed-outline', 'shield-outline', 'alert-outline',
  'analytics-outline', 'bar-chart-outline', 'pie-chart-outline', 'stats-chart-outline',
  'calendar-outline', 'time-outline', 'mail-outline', 'chatbubble-outline',
  'notifications-outline', 'heart-outline', 'star-outline', 'bookmark-outline',
  'cloud-outline', 'download-outline', 'upload-outline', 'share-outline',
  'link-outline', 'globe-outline', 'location-outline', 'map-outline',
  'search-outline', 'add-outline', 'remove-outline', 'close-outline',
  'checkmark-outline', 'arrow-back-outline', 'arrow-forward-outline', 'refresh-outline',
])

// 选择图标
const selectIcon = (icon: string) => {
  formData.value.icon = icon
  showIconPicker.value = false
}

// 获取菜单树形数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getMenuTree({
      keyword: queryParams.value.keyword,
      type: queryParams.value.type || undefined
    })
    
    // 确保响应数据格式正确
    tableData.value = response.data || []
    
    if (!response.data || response.data.length === 0) {
      message.warning('未获取到数据')
    }
  }
  catch (error: any) {
    tableData.value = []
    message.error(error.message || '获取数据失败')
  }
  finally {
    loading.value = false
  }
}

// 获取图标列表
const fetchIconList = async () => {
  try {
    const response = await getIconList()
    if (response.data && response.data.length > 0) {
      iconList.value = response.data
    }
  } catch (error) {
    // 使用默认图标列表
  }
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    keyword: '',
    type: null,
  }
  fetchData()
}

// 菜单类型变更
const handleTypeChange = (type: string) => {
  if (type === '按钮') {
    formData.value.icon = ''
    formData.value.path = ''
    formData.value.component = ''
    formData.value.redirect = ''
  }
}

// 新增菜单
const handleAdd = (_e?: MouseEvent, parentId = 0) => {
  modalTitle.value = '新增菜单'
  formData.value = {
    id: undefined,
    parentId: parentId,
    name: '',
    icon: '',
    path: '',
    component: '',
    redirect: '',
    type: '菜单',
    permission: '',
    orderNum: 0,
    hidden: false,
    keepAlive: false,
    status: true,
  }
  showModal.value = true
}

// 编辑菜单
const handleEdit = (row: Menu) => {
  modalTitle.value = '编辑菜单'
  formData.value = { ...row }
  showModal.value = true
}

// 删除菜单
const handleDelete = (row: Menu) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除菜单 "${row.name}" 吗？删除后不可恢复！`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteMenu(row.id)
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
        await updateMenu(formData.value.id, formData.value)
        message.success('更新成功')
      } else {
        // 新增
        await createMenu(formData.value)
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
  fetchIconList()
})
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.icon-name {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}
</style> 
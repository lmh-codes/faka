<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h3>商品管理</h3>
          <el-button type="primary" @click="showAddDialog">添加商品</el-button>
        </div>
      </template>

      <el-table :data="products" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100">
          <template #default="{ row }">
            {{ row.available_stock }}
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
            <el-button size="small" type="success" @click="showImportDialog(row)">
              导入卡密
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="productForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="productForm.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="productForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="productForm.imageUrl" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="productForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="productForm.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProduct">保存</el-button>
      </template>
    </el-dialog>

    <!-- 导入卡密对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入卡密"
      width="600px"
    >
      <el-alert
        title="格式说明"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <p>每行一个卡密，格式：卡号,密码（密码可选）</p>
        <p>示例：</p>
        <p>CARD123456,PASS123456</p>
        <p>CARD789012</p>
      </el-alert>
      <el-input
        v-model="cardsText"
        type="textarea"
        :rows="10"
        placeholder="请输入卡密，每行一个"
      />
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportCards">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminAPI, productAPI } from '@/api'

const products = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const currentProductId = ref(null)
const cardsText = ref('')

const productForm = ref({
  name: '',
  categoryId: null,
  price: 0,
  description: '',
  imageUrl: '',
  sortOrder: 0,
  status: 'active'
})

const loadProducts = async () => {
  try {
    const res = await adminAPI.getProducts()
    products.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadCategories = async () => {
  try {
    const res = await productAPI.getCategories()
    categories.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const showAddDialog = () => {
  dialogTitle.value = '添加商品'
  currentProductId.value = null
  productForm.value = {
    name: '',
    categoryId: null,
    price: 0,
    description: '',
    imageUrl: '',
    sortOrder: 0,
    status: 'active'
  }
  dialogVisible.value = true
}

const showEditDialog = (product) => {
  dialogTitle.value = '编辑商品'
  currentProductId.value = product.id
  productForm.value = {
    name: product.name,
    categoryId: product.category_id,
    price: product.price,
    description: product.description,
    imageUrl: product.image_url,
    sortOrder: product.sort_order,
    status: product.status
  }
  dialogVisible.value = true
}

const handleSaveProduct = async () => {
  try {
    if (currentProductId.value) {
      await adminAPI.updateProduct(currentProductId.value, productForm.value)
      ElMessage.success('商品更新成功')
    } else {
      await adminAPI.createProduct(productForm.value)
      ElMessage.success('商品创建成功')
    }
    dialogVisible.value = false
    loadProducts()
  } catch (error) {
    console.error(error)
  }
}

const showImportDialog = (product) => {
  currentProductId.value = product.id
  cardsText.value = ''
  importDialogVisible.value = true
}

const handleImportCards = async () => {
  if (!cardsText.value.trim()) {
    ElMessage.warning('请输入卡密')
    return
  }

  const lines = cardsText.value.trim().split('\n')
  const cards = lines.map(line => {
    const parts = line.split(',')
    return {
      number: parts[0].trim(),
      password: parts[1]?.trim() || null
    }
  })

  try {
    await adminAPI.importCards({
      productId: currentProductId.value,
      cards
    })
    ElMessage.success(`成功导入 ${cards.length} 张卡密`)
    importDialogVisible.value = false
    loadProducts()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

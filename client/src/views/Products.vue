<template>
  <div class="products-page">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="category-card">
            <template #header>
              <h3>商品分类</h3>
            </template>
            <el-menu :default-active="activeCategory" @select="handleCategoryChange">
              <el-menu-item index="">全部商品</el-menu-item>
              <el-menu-item v-for="cat in categories" :key="cat.id" :index="String(cat.id)">
                {{ cat.name }}
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>

        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="product in products" :key="product.id">
              <el-card class="product-card" @click="$router.push(`/product/${product.id}`)">
                <img :src="product.image_url || '/placeholder.png'" class="product-image" />
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="category">{{ product.category_name }}</p>
                  <p class="price">¥{{ product.price }}</p>
                  <p class="stock">库存: {{ product.available_stock }}</p>
                  <p class="sales">已售: {{ product.sales }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-pagination
            v-if="pagination.total > 0"
            class="pagination"
            :current-page="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productAPI } from '@/api'

const categories = ref([])
const products = ref([])
const activeCategory = ref('')
const pagination = ref({
  page: 1,
  limit: 12,
  total: 0
})

const loadCategories = async () => {
  try {
    const res = await productAPI.getCategories()
    categories.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadProducts = async () => {
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }
    if (activeCategory.value) {
      params.categoryId = activeCategory.value
    }
    
    const res = await productAPI.getProducts(params)
    products.value = res.data.products
    pagination.value = res.data.pagination
  } catch (error) {
    console.error(error)
  }
}

const handleCategoryChange = (index) => {
  activeCategory.value = index
  pagination.value.page = 1
  loadProducts()
}

const handlePageChange = (page) => {
  pagination.value.page = page
  loadProducts()
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  position: sticky;
  top: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  padding: 15px 0;
}

.product-info h3 {
  font-size: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category {
  color: #909399;
  font-size: 12px;
  margin-bottom: 8px;
}

.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stock, .sales {
  color: #909399;
  font-size: 14px;
  margin: 3px 0;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>

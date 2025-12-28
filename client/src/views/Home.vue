<template>
  <div class="home">
    <div class="banner">
      <div class="banner-content">
        <h1>专业的虚拟商品交易平台</h1>
        <p>安全 · 快速 · 便捷</p>
        <el-button type="primary" size="large" @click="$router.push('/products')">
          立即购买
        </el-button>
      </div>
    </div>

    <div class="container">
      <div class="features">
        <div class="feature-item">
          <el-icon :size="40" color="#409eff"><Lightning /></el-icon>
          <h3>极速发货</h3>
          <p>支付成功后自动发货，无需等待</p>
        </div>
        <div class="feature-item">
          <el-icon :size="40" color="#67c23a"><Lock /></el-icon>
          <h3>安全保障</h3>
          <p>正规渠道，品质保证</p>
        </div>
        <div class="feature-item">
          <el-icon :size="40" color="#e6a23c"><Money /></el-icon>
          <h3>分销赚钱</h3>
          <p>推广好友购买，获得丰厚佣金</p>
        </div>
        <div class="feature-item">
          <el-icon :size="40" color="#f56c6c"><Service /></el-icon>
          <h3>贴心服务</h3>
          <p>7x24小时在线客服</p>
        </div>
      </div>

      <div class="hot-products">
        <h2>热门商品</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
            <el-card class="product-card" @click="$router.push(`/product/${product.id}`)">
              <img :src="product.image_url || '/placeholder.png'" class="product-image" />
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="price">¥{{ product.price }}</p>
                <p class="stock">库存: {{ product.available_stock }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productAPI } from '@/api'

const products = ref([])

onMounted(async () => {
  try {
    const res = await productAPI.getProducts({ limit: 8 })
    products.value = res.data.products
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.banner-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner-content p {
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-item {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item h3 {
  margin: 20px 0 10px;
  font-size: 20px;
}

.feature-item p {
  color: #909399;
}

.hot-products h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
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
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stock {
  color: #909399;
  font-size: 14px;
}
</style>

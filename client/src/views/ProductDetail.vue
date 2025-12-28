<template>
  <div class="product-detail">
    <div class="container">
      <el-card v-if="product">
        <el-row :gutter="40">
          <el-col :span="10">
            <img :src="product.image_url || '/placeholder.png'" class="product-image" />
          </el-col>

          <el-col :span="14">
            <h1>{{ product.name }}</h1>
            <p class="category">分类: {{ product.category_name }}</p>
            <div class="price-box">
              <span class="price">¥{{ product.price }}</span>
              <span class="stock">库存: {{ product.available_stock }}</span>
            </div>

            <el-divider />

            <el-form :model="orderForm" label-width="100px">
              <el-form-item label="购买数量">
                <el-input-number v-model="orderForm.quantity" :min="1" :max="product.available_stock" />
              </el-form-item>

              <el-form-item label="联系邮箱">
                <el-input v-model="orderForm.email" placeholder="用于接收卡密信息" />
              </el-form-item>

              <el-form-item label="总价">
                <span class="total-price">¥{{ totalPrice }}</span>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="large" @click="handleBuy" :loading="loading">
                  立即购买
                </el-button>
              </el-form-item>
            </el-form>

            <el-divider />

            <div class="description">
              <h3>商品描述</h3>
              <p>{{ product.description || '暂无描述' }}</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productAPI, orderAPI } from '@/api'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const product = ref(null)
const loading = ref(false)
const orderForm = ref({
  quantity: 1,
  email: ''
})

const totalPrice = computed(() => {
  return product.value ? (product.value.price * orderForm.value.quantity).toFixed(2) : 0
})

const loadProduct = async () => {
  try {
    const res = await productAPI.getProductDetail(route.params.id)
    product.value = res.data
  } catch (error) {
    ElMessage.error('商品不存在')
    router.push('/products')
  }
}

const handleBuy = async () => {
  if (!orderForm.value.email) {
    ElMessage.warning('请输入联系邮箱')
    return
  }

  if (product.value.available_stock < orderForm.value.quantity) {
    ElMessage.warning('库存不足')
    return
  }

  loading.value = true
  try {
    const res = await orderAPI.createOrder({
      productId: product.value.id,
      quantity: orderForm.value.quantity,
      contactEmail: orderForm.value.email,
      userId: userStore.userInfo?.id
    })

    ElMessage.success('订单创建成功，请前往支付')
    
    // 跳转到支付页面（这里简化处理，实际应该跳转到支付页面）
    router.push(`/order/query?orderNo=${res.data.orderNo}`)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.product-image {
  width: 100%;
  border-radius: 8px;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.category {
  color: #909399;
  margin-bottom: 20px;
}

.price-box {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.price {
  color: #f56c6c;
  font-size: 36px;
  font-weight: bold;
}

.stock {
  color: #67c23a;
  font-size: 16px;
}

.total-price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
}

.description {
  margin-top: 20px;
}

.description h3 {
  margin-bottom: 10px;
}

.description p {
  color: #606266;
  line-height: 1.8;
}
</style>

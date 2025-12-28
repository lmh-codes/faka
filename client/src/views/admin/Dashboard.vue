<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="用户总数" :value="stats.userCount">
            <template #prefix>
              <el-icon color="#409eff"><User /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="订单总数" :value="stats.orderCount">
            <template #prefix>
              <el-icon color="#67c23a"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="今日订单" :value="stats.todayOrders">
            <template #prefix>
              <el-icon color="#e6a23c"><ShoppingCart /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总收入" :value="stats.totalRevenue" prefix="¥" :precision="2">
            <template #prefix>
              <el-icon color="#f56c6c"><Money /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>今日收入</h3>
          </template>
          <el-statistic :value="stats.todayRevenue" prefix="¥" :precision="2" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>快捷操作</h3>
          </template>
          <el-space wrap>
            <el-button type="primary" @click="$router.push('/admin/products')">
              商品管理
            </el-button>
            <el-button type="success" @click="$router.push('/admin/orders')">
              订单管理
            </el-button>
            <el-button type="warning" @click="$router.push('/admin/withdrawals')">
              提现审核
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/api'

const stats = ref({
  userCount: 0,
  orderCount: 0,
  todayOrders: 0,
  todayRevenue: 0,
  totalRevenue: 0
})

const loadStats = async () => {
  try {
    const res = await adminAPI.getStats()
    stats.value = res.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
}
</style>

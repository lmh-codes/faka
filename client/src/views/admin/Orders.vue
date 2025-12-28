<template>
  <el-card>
    <template #header>
      <h3>订单管理</h3>
    </template>

    <el-table :data="orders" stripe>
      <el-table-column prop="order_no" label="订单号" width="180" />
      <el-table-column prop="product_name" label="商品名称" />
      <el-table-column label="数量" width="80">
        <template #default="{ row }">
          {{ row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="120">
        <template #default="{ row }">
          <span style="color: #f56c6c">¥{{ row.total_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" width="100">
        <template #default="{ row }">
          <el-tag :type="paymentStatusType(row.payment_status)">
            {{ paymentStatusText(row.payment_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contact_email" label="联系邮箱" width="180" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
    </el-table>

    <el-pagination
      v-if="pagination.total > 0"
      class="pagination"
      :current-page="pagination.page"
      :page-size="pagination.limit"
      :total="pagination.total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/api'

const orders = ref([])
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0
})

const paymentStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'info'
  }
  return map[status] || 'info'
}

const paymentStatusText = (status) => {
  const map = {
    pending: '待支付',
    paid: '已支付',
    failed: '失败',
    refunded: '已退款'
  }
  return map[status] || status
}

const loadOrders = async () => {
  try {
    const res = await adminAPI.getOrders({
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    orders.value = res.data.orders
    pagination.value = res.data.pagination
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = (page) => {
  pagination.value.page = page
  loadOrders()
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

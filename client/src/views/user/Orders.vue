<template>
  <el-card>
    <template #header>
      <h3>我的订单</h3>
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
          <el-tag :type="row.payment_status === 'paid' ? 'success' : 'warning'">
            {{ paymentStatusText(row.payment_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="viewOrder(row.order_no)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
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
import { useRouter } from 'vue-router'
import { orderAPI } from '@/api'

const router = useRouter()
const orders = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

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
    const res = await orderAPI.getMyOrders({
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

const viewOrder = (orderNo) => {
  router.push(`/order/query?orderNo=${orderNo}`)
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

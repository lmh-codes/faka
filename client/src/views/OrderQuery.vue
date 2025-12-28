<template>
  <div class="order-query">
    <div class="container">
      <el-card>
        <template #header>
          <h2>订单查询</h2>
        </template>

        <el-form :model="form" @submit.prevent="handleQuery">
          <el-form-item label="订单号">
            <el-input v-model="form.orderNo" placeholder="请输入订单号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" :loading="loading">
              查询订单
            </el-button>
          </el-form-item>
        </el-form>

        <el-divider v-if="order" />

        <div v-if="order" class="order-detail">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ order.order_no }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{ order.product_name }}</el-descriptions-item>
            <el-descriptions-item label="购买数量">{{ order.quantity }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">
              <span style="color: #f56c6c; font-weight: bold">¥{{ order.total_price }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="支付状态">
              <el-tag :type="order.payment_status === 'paid' ? 'success' : 'warning'">
                {{ paymentStatusText(order.payment_status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="order.status === 'completed' ? 'success' : 'info'">
                {{ orderStatusText(order.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ order.created_at }}</el-descriptions-item>
            <el-descriptions-item label="联系邮箱">{{ order.contact_email }}</el-descriptions-item>
          </el-descriptions>

          <div v-if="order.payment_status === 'pending'" class="payment-section">
            <h3>选择支付方式</h3>
            <el-radio-group v-model="paymentMethod">
              <el-radio label="alipay">支付宝</el-radio>
              <el-radio label="wxpay">微信支付</el-radio>
            </el-radio-group>
            <el-button type="primary" @click="handlePay" style="margin-top: 20px">
              前往支付
            </el-button>
          </div>

          <div v-if="order.payment_status === 'paid' && order.cards" class="cards-section">
            <h3>卡密信息</h3>
            <el-table :data="order.cards" border>
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="card_number" label="卡号" />
              <el-table-column prop="card_password" label="密码" />
            </el-table>
            <el-alert
              title="请妥善保管卡密信息，已发送到您的邮箱"
              type="success"
              :closable="false"
              style="margin-top: 20px"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { orderAPI, paymentAPI } from '@/api'

const form = ref({
  orderNo: ''
})

const order = ref(null)
const loading = ref(false)
const paymentMethod = ref('alipay')

const paymentStatusText = (status) => {
  const map = {
    pending: '待支付',
    paid: '已支付',
    failed: '支付失败',
    refunded: '已退款'
  }
  return map[status] || status
}

const orderStatusText = (status) => {
  const map = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const handleQuery = async () => {
  if (!form.value.orderNo) {
    ElMessage.warning('请输入订单号')
    return
  }

  loading.value = true
  try {
    const res = await orderAPI.queryOrder(form.value.orderNo)
    order.value = res.data
  } catch (error) {
    order.value = null
  } finally {
    loading.value = false
  }
}

const handlePay = async () => {
  try {
    const res = await paymentAPI.createPayment({
      orderNo: order.value.order_no,
      paymentMethod: paymentMethod.value
    })

    // 跳转到支付页面
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = res.data.payUrl

    Object.keys(res.data.params).forEach(key => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = res.data.params[key]
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.order-detail {
  margin-top: 20px;
}

.payment-section,
.cards-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.payment-section h3,
.cards-section h3 {
  margin-bottom: 15px;
}
</style>

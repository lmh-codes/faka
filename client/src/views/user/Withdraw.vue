<template>
  <div>
    <el-card>
      <template #header>
        <h3>申请提现</h3>
      </template>

      <el-alert
        title="提现说明"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <p>1. 最低提现金额：¥10</p>
        <p>2. 提现申请提交后，将在1-3个工作日内处理</p>
        <p>3. 请确保提现账户信息准确无误</p>
      </el-alert>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="当前余额">
          <span style="color: #f56c6c; font-size: 24px; font-weight: bold">
            ¥{{ balance }}
          </span>
        </el-form-item>

        <el-form-item label="提现金额" prop="amount">
          <el-input-number v-model="form.amount" :min="10" :max="balance" :precision="2" />
        </el-form-item>

        <el-form-item label="提现方式" prop="accountType">
          <el-radio-group v-model="form.accountType">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信</el-radio>
            <el-radio label="bank">银行卡</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="账户信息" prop="accountInfo">
          <el-input
            v-model="form.accountInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入账户信息（支付宝账号/微信号/银行卡号+开户行）"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <h3>提现记录</h3>
      </template>

      <el-table :data="withdrawals" stripe>
        <el-table-column label="提现金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="account_type" label="提现方式" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="created_at" label="申请时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userAPI } from '@/api'

const formRef = ref()
const loading = ref(false)
const balance = ref(0)
const withdrawals = ref([])

const form = ref({
  amount: 10,
  accountType: 'alipay',
  accountInfo: ''
})

const rules = {
  amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
  accountType: [{ required: true, message: '请选择提现方式', trigger: 'change' }],
  accountInfo: [{ required: true, message: '请输入账户信息', trigger: 'blur' }]
}

const statusType = (status) => {
  const map = {
    pending: 'warning',
    approved: 'info',
    rejected: 'danger',
    completed: 'success'
  }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = {
    pending: '待审核',
    approved: '已批准',
    rejected: '已拒绝',
    completed: '已完成'
  }
  return map[status] || status
}

const loadProfile = async () => {
  try {
    const res = await userAPI.getProfile()
    balance.value = res.data.balance
  } catch (error) {
    console.error(error)
  }
}

const loadWithdrawals = async () => {
  try {
    const res = await userAPI.getWithdrawals()
    withdrawals.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()

  loading.value = true
  try {
    await userAPI.withdraw(form.value)
    ElMessage.success('提现申请已提交')
    form.value.accountInfo = ''
    loadProfile()
    loadWithdrawals()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadWithdrawals()
})
</script>

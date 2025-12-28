<template>
  <div class="distribution">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <el-statistic title="我的邀请码" :value="stats.inviteCode" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="账户余额" :value="stats.balance" prefix="¥" :precision="2" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="累计佣金" :value="stats.totalCommission" prefix="¥" :precision="2" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="团队人数" :value="stats.level1Count + stats.level2Count" />
        </el-card>
      </el-col>
    </el-row>

    <el-card class="invite-card">
      <template #header>
        <h3>推广链接</h3>
      </template>
      <el-input v-model="inviteLink" readonly>
        <template #append>
          <el-button @click="copyLink">复制</el-button>
        </template>
      </el-input>
      <p class="tip">分享此链接，好友注册后您将获得佣金</p>
    </el-card>

    <el-card>
      <template #header>
        <h3>佣金记录</h3>
      </template>
      <el-table :data="commissions" stripe>
        <el-table-column prop="order_no" label="订单号" />
        <el-table-column prop="product_name" label="商品" />
        <el-table-column prop="from_username" label="购买用户" />
        <el-table-column label="佣金等级">
          <template #default="{ row }">
            <el-tag :type="row.level === 1 ? 'success' : 'warning'">
              {{ row.level === 1 ? '一级' : '二级' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="佣金金额">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { distributionAPI } from '@/api'

const stats = ref({
  inviteCode: '',
  balance: 0,
  totalCommission: 0,
  level1Count: 0,
  level2Count: 0
})

const commissions = ref([])

const inviteLink = computed(() => {
  return `${window.location.origin}/register?invite=${stats.value.inviteCode}`
})

const loadStats = async () => {
  try {
    const res = await distributionAPI.getStats()
    stats.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadCommissions = async () => {
  try {
    const res = await distributionAPI.getCommissions()
    commissions.value = res.data.commissions
  } catch (error) {
    console.error(error)
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value)
  ElMessage.success('复制成功')
}

onMounted(() => {
  loadStats()
  loadCommissions()
})
</script>

<style scoped>
.distribution {
  padding: 20px;
}

.invite-card {
  margin: 20px 0;
}

.tip {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}
</style>

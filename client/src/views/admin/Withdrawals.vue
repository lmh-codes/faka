<template>
  <el-card>
    <template #header>
      <h3>提现管理</h3>
    </template>

    <el-table :data="withdrawals" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column label="提现金额" width="120">
        <template #default="{ row }">
          <span style="color: #f56c6c; font-weight: bold">¥{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account_type" label="提现方式" width="100" />
      <el-table-column prop="account_info" label="账户信息" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="申请时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="success"
            @click="handleApprove(row.id)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="danger"
            @click="handleReject(row.id)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminAPI } from '@/api'

const withdrawals = ref([])

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

const loadWithdrawals = async () => {
  try {
    const res = await adminAPI.getWithdrawals()
    withdrawals.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const handleApprove = async (id) => {
  try {
    await ElMessageBox.confirm('确认通过此提现申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await adminAPI.updateWithdrawal(id, {
      status: 'completed',
      remark: '提现已处理'
    })

    ElMessage.success('操作成功')
    loadWithdrawals()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleReject = async (id) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝提现', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入拒绝原因'
    })

    await adminAPI.updateWithdrawal(id, {
      status: 'rejected',
      remark: value
    })

    ElMessage.success('操作成功')
    loadWithdrawals()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(() => {
  loadWithdrawals()
})
</script>

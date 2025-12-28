<template>
  <el-card>
    <template #header>
      <h3>用户管理</h3>
    </template>

    <el-table :data="users" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
            {{ row.role === 'admin' ? '管理员' : '用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="120">
        <template #default="{ row }">
          ¥{{ row.balance }}
        </template>
      </el-table-column>
      <el-table-column label="累计佣金" width="120">
        <template #default="{ row }">
          ¥{{ row.total_commission }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="180" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/api'

const users = ref([])

const loadUsers = async () => {
  try {
    const res = await adminAPI.getUsers()
    users.value = res.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

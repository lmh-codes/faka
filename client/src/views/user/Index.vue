<template>
  <div class="user-center">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <el-menu :default-active="activeMenu" router>
              <el-menu-item index="/user/orders">
                <el-icon><Document /></el-icon>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="/user/distribution">
                <el-icon><Share /></el-icon>
                <span>分销中心</span>
              </el-menu-item>
              <el-menu-item index="/user/withdraw">
                <el-icon><Money /></el-icon>
                <span>申请提现</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>

        <el-col :span="18">
          <router-view />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

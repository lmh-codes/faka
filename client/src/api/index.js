import request from '@/utils/request'

// 认证相关
export const authAPI = {
  login: (data) => request.post('/auth/login', data),
  register: (data) => request.post('/auth/register', data)
}

// 商品相关
export const productAPI = {
  getCategories: () => request.get('/products/categories'),
  getProducts: (params) => request.get('/products', { params }),
  getProductDetail: (id) => request.get(`/products/${id}`)
}

// 订单相关
export const orderAPI = {
  createOrder: (data) => request.post('/orders/create', data),
  queryOrder: (orderNo) => request.get(`/orders/query/${orderNo}`),
  getMyOrders: (params) => request.get('/orders/my-orders', { params })
}

// 支付相关
export const paymentAPI = {
  createPayment: (data) => request.post('/payment/create', data)
}

// 用户相关
export const userAPI = {
  getProfile: () => request.get('/users/profile'),
  withdraw: (data) => request.post('/users/withdraw', data),
  getWithdrawals: () => request.get('/users/withdrawals')
}

// 分销相关
export const distributionAPI = {
  getStats: () => request.get('/distribution/stats'),
  getCommissions: (params) => request.get('/distribution/commissions', { params }),
  getTeam: (params) => request.get('/distribution/team', { params })
}

// 管理员相关
export const adminAPI = {
  getStats: () => request.get('/admin/stats'),
  getProducts: () => request.get('/admin/products'),
  createProduct: (data) => request.post('/admin/products', data),
  updateProduct: (id, data) => request.put(`/admin/products/${id}`, data),
  importCards: (data) => request.post('/admin/cards/import', data),
  getOrders: (params) => request.get('/admin/orders', { params }),
  getUsers: () => request.get('/admin/users'),
  getWithdrawals: () => request.get('/admin/withdrawals'),
  updateWithdrawal: (id, data) => request.put(`/admin/withdrawals/${id}`, data)
}

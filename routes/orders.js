import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import content from '../middleware/content.js'
import { createOrder, getMyOrders, getAllOrders, deleteOrder } from '../controllers/orders.js'

const router = Router()

// 建立訂單
router.post('/', jwt, createOrder)
// 取自己訂單
router.get('/', jwt, getMyOrders)
// 取所有人訂單(管理員)
router.get('/all', jwt, admin, getAllOrders)
// 管理員移除訂單
router.patch('/delete/:id', content('application/json'), jwt, admin, deleteOrder)

export default router

import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { register, login, logout, extend, getUser, editUser, editCart, getCart, getAllUsers, editLove, getLove, getLoveById } from '../controllers/users.js'
const router = Router()

// 不要讓別人傳太多資料，阻擋多一點，可以傳資料型態
// express 的 middleware 一定是要寫 function
// post 的請求一定要是 json 格式

//  content('application/json') => postman 裡面的 header 的 Content-Type 的 value
router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
// 取自己的資料
router.get('/me', auth.jwt, getUser)
// 修改自己的資料
router.patch('/edit', content('application/json'), auth.jwt, editUser)
// 加入、編輯購物車
router.post('/cart', content('application/json'), auth.jwt, editCart)
// 取購物車內容回傳給前端
router.get('/cart', auth.jwt, getCart)
// 取所有人訂單(管理員)
router.get('/all', auth.jwt, admin, getAllUsers)

router.post('/love', content('application/json'), auth.jwt, editLove)
router.get('/love', auth.jwt, getLove)
router.get('/love/:id', auth.jwt, getLoveById)

export default router

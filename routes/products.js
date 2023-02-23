import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createProduct, getAllProducts, getProduct, getSellProducts, editProduct, getProducRecom } from '../controllers/products.js'

const router = Router()

// multipart可以上傳圖片，有上傳圖片的話用 content('multipart/form-data') => const fd = new FormData()
// 單純字串就用 application/json 資料型態即可，form

// upload要放在  jwt, admin 之後 不然不用登入就可以用了
router.post('/', content('multipart/form-data'), jwt, admin, upload, createProduct)
// 不用登入也可以查所有架上商品
router.get('/', getSellProducts)
// .get('/all') 跟 .get('/:id') 順序有差，若 get all放後面，all會被認為是 id

// 取全部商品是管理員
router.get('/all', jwt, admin, getAllProducts)
// 取單個商品
router.get('/:id', getProduct)
// 取推薦商品
router.get('/:id/recom', getProducRecom)
// 更新，管理員權限
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editProduct)
// router.patch('/delete/:id', content('application/json'), jwt, admin, deleteProduct)

export default router

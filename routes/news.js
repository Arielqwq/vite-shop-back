import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createNews, getNews, editNews } from '../controllers/news.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createNews)
// 不用登入也可以查關於我們
router.get('/', getNews)
// 修改更新，管理員權限
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editNews)

export default router

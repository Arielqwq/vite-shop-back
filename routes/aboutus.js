import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getAboutus, editAboutus } from '../controllers/aboutus.js'

const router = Router()

// router.post('/', content('multipart/form-data'), jwt, admin, upload, createAboutus)
// 不用登入也可以查關於我們
router.get('/', getAboutus)
// 修改更新，管理員權限
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editAboutus)

export default router

import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createFeedback, getMyFeedbacks, getAllFeedbacks, replyFeedbacks } from '../controllers/feedbacks.js'

const router = Router()

router.post('/', content('application/json'), jwt, createFeedback)
// 不用登入也可以查所有消息
router.get('/me', jwt, getMyFeedbacks)

// 取全部活動是管理員
router.get('/all', jwt, admin, getAllFeedbacks)

// 修改更新，管理員權限
router.patch('/:id', content('application/json'), jwt, admin, upload, replyFeedbacks)

export default router

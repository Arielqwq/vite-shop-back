import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import { createFeedback, getMyFeedbacks, getAllFeedbacks, replyFeedbacks } from '../controllers/feedbacks.js'

const router = Router()

router.post('/', content('application/json'), jwt, createFeedback)

// 查自己的回應
router.get('/', jwt, getMyFeedbacks)

// 取全部回應是管理員
router.get('/all', jwt, admin, getAllFeedbacks)

// 修改更新，管理員權限
router.patch('/:id', content('application/json'), jwt, admin, replyFeedbacks)

export default router

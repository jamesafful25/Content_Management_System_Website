import { Router } from 'express'
import { login, registerAdmin, getProfile, changePassword } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isSuperAdmin } from '../middleware/roleMiddleware.js'

const router = Router()

router.post('/login', login)
router.post('/register', protect, isSuperAdmin, registerAdmin)
router.get('/profile', protect, getProfile)
router.put('/change-password', protect, changePassword)

export default router

import { Router } from 'express'
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isSuperAdmin } from '../middleware/roleMiddleware.js'

const router = Router()

// All user management is superadmin only
router.use(protect, isSuperAdmin)

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router

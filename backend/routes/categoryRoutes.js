import { Router } from 'express'
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isEditorOrAbove } from '../middleware/roleMiddleware.js'

const router = Router()

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
router.get('/', getAllCategories)
router.get('/:slug', getCategoryBySlug)

// ─── ADMIN ────────────────────────────────────────────────────────────────────
router.post('/', protect, isEditorOrAbove, createCategory)
router.put('/:id', protect, isEditorOrAbove, updateCategory)
router.delete('/:id', protect, isEditorOrAbove, deleteCategory)

export default router

import { Router } from 'express'
import {
  getPublishedPosts,
  getFeaturedPosts,
  getPostBySlug,
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isAuthorOrAbove, isEditorOrAbove } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = Router()

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
router.get('/', getPublishedPosts)
router.get('/featured', getFeaturedPosts)
router.get('/slug/:slug', getPostBySlug)

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
router.get('/admin/all', protect, isAuthorOrAbove, getAdminPosts)
router.get('/admin/:id', protect, isAuthorOrAbove, getAdminPostById)
router.post('/admin', protect, isAuthorOrAbove, upload.single('image'), createPost)
router.put('/admin/:id', protect, isAuthorOrAbove, upload.single('image'), updatePost)
router.delete('/admin/:id', protect, isEditorOrAbove, deletePost)

export default router

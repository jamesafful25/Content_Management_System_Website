import {
  getAllPublishedPostsService,
  getFeaturedPostsService,
  getPostBySlugService,
  getAdminPostsService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService
} from '../services/postService.js'

// ─── PUBLIC CONTROLLERS ──────────────────────────────────────────────────────

export const getPublishedPosts = async (req, res, next) => {
  try {
    const data = await getAllPublishedPostsService(req.query)
    res.status(200).json({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await getFeaturedPostsService(req.query.limit)
    res.status(200).json({ success: true, posts })
  } catch (error) {
    next(error)
  }
}

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await getPostBySlugService(req.params.slug)
    res.status(200).json({ success: true, post })
  } catch (error) {
    next(error)
  }
}

// ─── ADMIN CONTROLLERS ────────────────────────────────────────────────────────

export const getAdminPosts = async (req, res, next) => {
  try {
    const data = await getAdminPostsService(req.query)
    res.status(200).json({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

export const getAdminPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id)
    res.status(200).json({ success: true, post })
  } catch (error) {
    next(error)
  }
}

export const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.body, req.user.id, req.file)
    res.status(201).json({ success: true, post })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const post = await updatePostService(req.params.id, req.body, req.file)
    res.status(200).json({ success: true, post })
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    const result = await deletePostService(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

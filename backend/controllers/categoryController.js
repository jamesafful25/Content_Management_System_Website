import {
  getAllCategoriesService,
  getCategoryBySlugService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
} from '../services/categoryService.js'

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService()
    res.status(200).json({ success: true, categories })
  } catch (error) {
    next(error)
  }
}

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await getCategoryBySlugService(req.params.slug)
    res.status(200).json({ success: true, category })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body
    if (!name) return res.status(400).json({ message: 'Category name is required' })
    const category = await createCategoryService({ name, description })
    res.status(201).json({ success: true, category })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body)
    res.status(200).json({ success: true, category })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await deleteCategoryService(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

import slugify from 'slugify'
import { Category, Post } from '../models/index.js'

/**
 * Get all categories with post count (public)
 */
export const getAllCategoriesService = async () => {
  const categories = await Category.findAll({
    include: [{
      model: Post,
      as: 'posts',
      where: { isPublished: true },
      required: false,
      attributes: []
    }],
    order: [['name', 'ASC']]
  })
  return categories
}

/**
 * Get single category by slug
 */
export const getCategoryBySlugService = async (slug) => {
  const category = await Category.findOne({ where: { slug } })
  if (!category) {
    throw Object.assign(new Error('Category not found'), { statusCode: 404 })
  }
  return category
}

/**
 * Create category (admin)
 */
export const createCategoryService = async ({ name, description }) => {
  const slug = slugify(name, { lower: true, strict: true })
  const existing = await Category.findOne({ where: { slug } })
  if (existing) {
    throw Object.assign(new Error('Category already exists'), { statusCode: 400 })
  }
  return await Category.create({ name, slug, description })
}

/**
 * Update category (admin)
 */
export const updateCategoryService = async (id, { name, description }) => {
  const category = await Category.findByPk(id)
  if (!category) {
    throw Object.assign(new Error('Category not found'), { statusCode: 404 })
  }
  const slug = slugify(name, { lower: true, strict: true })
  await category.update({ name, slug, description })
  return category
}

/**
 * Delete category (admin)
 */
export const deleteCategoryService = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) {
    throw Object.assign(new Error('Category not found'), { statusCode: 404 })
  }
  await category.destroy()
  return { message: 'Category deleted successfully' }
}

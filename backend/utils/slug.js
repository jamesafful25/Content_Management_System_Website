import slugify from 'slugify'
import { Post } from '../models/index.js'

/**
 * Generate a unique slug from a title
 * @param {string} title
 * @returns {string} unique slug
 */
export const generateSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true })
  let existing = await Post.findOne({ where: { slug } })
  let counter = 1

  while (existing) {
    slug = `${slugify(title, { lower: true, strict: true })}-${counter}`
    existing = await Post.findOne({ where: { slug } })
    counter++
  }

  return slug
}

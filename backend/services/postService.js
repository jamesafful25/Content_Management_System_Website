import { Op } from 'sequelize'
import { Post, User, Category } from '../models/index.js'
import { generateSlug } from '../utils/slug.js'
import { uploadImage, deleteImage, getImageUrl } from './imageStorageService.js'

// Common include for author + category
const postIncludes = [
    { model: User, as: 'author', attributes: ['id', 'name', 'email', 'avatar'] },
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
]

/**
 * Convert a Sequelize post into a plain object
 * and attach its environment-specific image URL.
 */
const serializePost = async(post) => {
    const postData = post.toJSON()

    return {
        ...postData,
        imageUrl: await getImageUrl(postData.image)
    }
}

/**
 * Get all published posts (public)
 */
export const getAllPublishedPostsService = async({ page = 1, limit = 10, categorySlug, search }) => {
    const offset = (page - 1) * limit
    const where = { isPublished: true }

    if (search) {
        where[Op.or] = [{
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                summary: {
                    [Op.like]: `%${search}%`
                }
            }
        ]
    }

    let categoryWhere = {}
    if (categorySlug) {
        categoryWhere = { slug: categorySlug }
    }

    const { count, rows } = await Post.findAndCountAll({
        where,
        include: [
            { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug'], where: categorySlug ? categoryWhere : undefined }
        ],
        order: [
            ['publishedAt', 'DESC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
    })

    return {
        posts: await Promise.all(rows.map(serializePost)),
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
    }
}

/**
 * Get featured posts for carousel (public)
 */
export const getFeaturedPostsService = async(limit = 5) => {
    const posts = await Post.findAll({
        where: { isPublished: true, isFeatured: true },
        include: postIncludes,
        order: [
            ['publishedAt', 'DESC']
        ],
        limit: parseInt(limit)
    })

    return await Promise.all(posts.map(serializePost))
}

/**
 * Get single post by slug + increment views (public)
 */
export const getPostBySlugService = async(slug) => {
    const post = await Post.findOne({
        where: { slug, isPublished: true },
        include: postIncludes
    })

    if (!post) {
        throw Object.assign(new Error('Post not found'), { statusCode: 404 })
    }

    await post.increment('views')

    return await serializePost(post)
}

/**
 * Get all posts for admin (all statuses)
 */
export const getAdminPostsService = async({ page = 1, limit = 10, search, isPublished }) => {
    const offset = (page - 1) * limit
    const where = {}

    if (search) {
        where[Op.or] = [{
            title: {
                [Op.like]: `%${search}%`
            }
        }]
    }

    if (isPublished !== undefined) {
        where.isPublished = isPublished === 'true'
    }

    const { count, rows } = await Post.findAndCountAll({
        where,
        include: postIncludes,
        order: [
            ['createdAt', 'DESC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
    })

    return {
        posts: await Promise.all(rows.map(serializePost)),
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
    }
}

/**
 * Get single post by ID for admin
 */
export const getPostByIdService = async(id) => {
    const post = await Post.findByPk(id, { include: postIncludes })

    if (!post) {
        throw Object.assign(new Error('Post not found'), { statusCode: 404 })
    }

    return await serializePost(post)
}

/**
 * Create a new post
 */
export const createPostService = async({ title, summary, content, categoryId, isFeatured, isPublished },
    authorId,
    imageFile
) => {
    const slug = await generateSlug(title)

    // Upload the image using the appropriate storage system.
    const imageKey = await uploadImage(imageFile)

    try {
        const post = await Post.create({
            title,
            slug,
            summary,
            content,
            categoryId,
            authorId,
            image: imageKey,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isPublished: isPublished === 'true' || isPublished === true,
            publishedAt: (isPublished === 'true' || isPublished === true) ?
                new Date() : null
        })

        return await getPostByIdService(post.id)

    } catch (error) {
        // Clean up the uploaded image if post creation fails.
        if (imageKey) {
            try {
                await deleteImage(imageKey)
            } catch (cleanupError) {
                console.error('Image cleanup failed:', cleanupError.message)
            }
        }

        throw error
    }
}

/**
 * Update a post
 */
export const updatePostService = async(id, data, imageFile) => {
    const post = await Post.findByPk(id)

    if (!post) {
        throw Object.assign(new Error('Post not found'), { statusCode: 404 })
    }

    const oldImageKey = post.image
    const wasPublished = post.isPublished
    const nowPublishing = data.isPublished === 'true' || data.isPublished === true

    const newImageKey = imageFile ?
        await uploadImage(imageFile) :
        null

    try {
        await post.update({
            ...data,
            image: newImageKey || oldImageKey,
            isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
            isPublished: nowPublishing,
            publishedAt: (!wasPublished && nowPublishing) ?
                new Date() : post.publishedAt
        })

    } catch (error) {
        if (newImageKey) {
            try {
                await deleteImage(newImageKey)
            } catch (cleanupError) {
                console.error('New image cleanup failed:', cleanupError.message)
            }
        }

        throw error
    }

    // Delete the old image only after the database update succeeds.
    if (newImageKey && oldImageKey) {
        try {
            await deleteImage(oldImageKey)
        } catch (cleanupError) {
            console.error('Old image cleanup failed:', cleanupError.message)
        }
    }

    return await getPostByIdService(id)
}

/**
 * Delete a post
 */
export const deletePostService = async(id) => {
    const post = await Post.findByPk(id)

    if (!post) {
        throw Object.assign(new Error('Post not found'), { statusCode: 404 })
    }

    const imageKey = post.image

    // Delete the database record first.
    await post.destroy()

    // Then remove the associated image.
    if (imageKey) {
        try {
            await deleteImage(imageKey)
        } catch (cleanupError) {
            console.error('Image deletion failed:', cleanupError.message)
        }
    }

    return { message: 'Post deleted successfully' }
}
import User from './User.js'
import Post from './Post.js'
import Category from './Category.js'

// User → Posts (one to many)
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts', onDelete: 'SET NULL' })
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' })

// Category → Posts (one to many)
Category.hasMany(Post, { foreignKey: 'categoryId', as: 'posts', onDelete: 'SET NULL' })
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

export { User, Post, Category }

import { User } from '../models/index.js'
import { hashPassword } from '../utils/password.js'

/**
 * Get all admin users (superadmin only)
 */
export const getAllUsersService = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  })
}

/**
 * Get single user by ID
 */
export const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }
  return user
}

/**
 * Update user role or status (superadmin only)
 */
export const updateUserService = async (id, { role, isActive, name }) => {
  const user = await User.findByPk(id)
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }
  await user.update({ role, isActive, name })
  const updated = user.toJSON()
  delete updated.password
  return updated
}

/**
 * Delete user (superadmin only)
 */
export const deleteUserService = async (id, requesterId) => {
  if (parseInt(id) === parseInt(requesterId)) {
    throw Object.assign(new Error('You cannot delete your own account'), { statusCode: 400 })
  }
  const user = await User.findByPk(id)
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }
  await user.destroy()
  return { message: 'User deleted successfully' }
}

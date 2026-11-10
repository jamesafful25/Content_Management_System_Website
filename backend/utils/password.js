import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/**
 * Hash a plain text password
 * @param {string} password
 * @returns {string} hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare plain text password with hashed password
 * @param {string} password - plain text
 * @param {string} hashedPassword - from database
 * @returns {boolean}
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

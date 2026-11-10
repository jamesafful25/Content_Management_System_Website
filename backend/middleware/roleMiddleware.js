/**
 * Restrict access to specific roles
 * @param  {...string} roles - allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      })
    }
    next()
  }
}

// Shorthand role guards
export const isSuperAdmin = restrictTo('superadmin')
export const isEditorOrAbove = restrictTo('superadmin', 'editor')
export const isAuthorOrAbove = restrictTo('superadmin', 'editor', 'author')

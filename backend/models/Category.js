import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'categories'
})

export default Category

import bcrypt from 'bcryptjs'
import { connectDB } from './config/db.js'
import { User } from './models/index.js'

await connectDB()

const hashed = await bcrypt.hash('Admin@1234', 12)

await User.create({
    name: 'Super Admin',
    email: 'afful25@yahoo.com',
    password: hashed,
    role: 'superadmin',
    isActive: true
})

console.log('Superadmin created!')
console.log('Email: admin@example.com')
console.log('Password: admin123')
process.exit()
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                ca: readFileSync(new URL('../certs/global-bundle.pem', import.meta.url)),
                rejectUnauthorized: true
            }
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

export const connectDB = async() => {
    try {
        await sequelize.authenticate()
        console.log('MySQL connected successfully')
    } catch (error) {
        console.error('MySQL connection failed:', error.message)
        process.exit(1)
    }
}

export default sequelize

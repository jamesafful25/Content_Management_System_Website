import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Get the directory containing this migration runner
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

// 2. Define the migration file
const migrationFile = path.join(__dirname, '001-create-initial-schema.sql')

// 3. Define the migration name
const migrationName = '001-create-initial-schema'

// 4. Create the database connection
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(new URL('../certs/global-bundle.pem',
            import.meta.url)),
        rejectUnauthorized: true
    },
    multipleStatements: true
})

const runMigration = async() => {
    try {
        // 5. Create a table to track completed migrations
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT NOT NULL AUTO_INCREMENT,
                migration_name VARCHAR(255) NOT NULL,
                executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_migration_name (migration_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        // 6. Check whether this migration has already run
        const [existingMigrations] = await connection.execute(
            'SELECT migration_name FROM schema_migrations WHERE migration_name = ?', [migrationName]
        )

        if (existingMigrations.length > 0) {
            console.log(`Migration already completed: ${migrationName}`)
            return
        }

        // 7. Read the SQL migration file
        const migrationSQL = fs.readFileSync(migrationFile, 'utf8')

        // 8. Execute the SQL statements
        await connection.query(migrationSQL)

        // 9. Record the successful migration
        await connection.execute(
            'INSERT INTO schema_migrations (migration_name) VALUES (?)', [migrationName]
        )

        console.log(`Migration completed successfully: ${migrationName}`)

    } catch (error) {
        console.error('Database migration failed:', error.message)
        throw error

    } finally {
        // 10. Close the database connection
        await connection.end()
    }
}

runMigration().catch(() => {
    process.exitCode = 1
})
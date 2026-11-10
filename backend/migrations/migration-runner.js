import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --------------------------------------------------
// 1. Identify the migration file
// --------------------------------------------------

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

const migrationFile = path.join(
    __dirname,
    '001-create-initial-schema.sql'
)

const migrationName = '001-create-initial-schema'

// --------------------------------------------------
// 2. Run the database migration
// --------------------------------------------------

const runMigration = async() => {
    let connection

    try {
        // 3. Establish the database connection
        console.log('Connecting to the RDS database...')

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: fs.readFileSync(
                    new URL('../certs/global-bundle.pem',
                        import.meta.url)
                ),
                rejectUnauthorized: true
            },
            multipleStatements: true,
            connectTimeout: 15000
        })

        // 4. Create the migration tracking table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT NOT NULL AUTO_INCREMENT,
                migration_name VARCHAR(255) NOT NULL,
                executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_migration_name (migration_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        // 5. Check whether this migration has already run
        const [existingMigrations] = await connection.execute(
            'SELECT migration_name FROM schema_migrations WHERE migration_name = ?', [migrationName]
        )

        if (existingMigrations.length > 0) {
            console.log(`Migration already completed: ${migrationName}`)
            return
        }

        // 6. Read the SQL migration file
        const migrationSQL = fs.readFileSync(migrationFile, 'utf8')

        // 7. Execute the SQL statements
        await connection.query(migrationSQL)

        // 8. Record the successful migration
        await connection.execute(
            'INSERT INTO schema_migrations (migration_name) VALUES (?)', [migrationName]
        )

        console.log(`Migration completed successfully: ${migrationName}`)

    } catch (error) {
        console.error('Database migration failed:', error.message)
        throw error

    } finally {
        // 9. Close the connection if it was established
        if (connection) {
            await connection.end()
        }
    }
}

// --------------------------------------------------
// 10. Execute the migration
// --------------------------------------------------

runMigration().catch(() => {
    process.exitCode = 1
})
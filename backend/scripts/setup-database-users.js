import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import crypto from 'crypto'
import {
    SecretsManagerClient,
    GetSecretValueCommand,
    PutSecretValueCommand
} from '@aws-sdk/client-secrets-manager'

// --------------------------------------------------
// 1. Validate required environment variables
// --------------------------------------------------

const requiredVariables = [
    'AWS_REGION',
    'RDS_MASTER_SECRET_ARN',
    'RUNTIME_DB_SECRET_ARN',
    'MIGRATION_DB_SECRET_ARN',
    'DB_NAME'
]

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`)
    }
}

// --------------------------------------------------
// 2. Initialize AWS Secrets Manager client
// --------------------------------------------------

const secretsManager = new SecretsManagerClient({
    region: process.env.AWS_REGION
})

// --------------------------------------------------
// 3. Define database account names
// --------------------------------------------------

const runtimeUsername = 'cms_app_user'
const migrationUsername = 'cms_migration_user'

// Generate independent passwords for both accounts.
const runtimePassword = crypto.randomBytes(48).toString('base64url')
const migrationPassword = crypto.randomBytes(48).toString('base64url')

// --------------------------------------------------
// 4. Retrieve the RDS master credentials
// --------------------------------------------------

const getMasterCredentials = async() => {
    const response = await secretsManager.send(
        new GetSecretValueCommand({
            SecretId: process.env.RDS_MASTER_SECRET_ARN
        })
    )

    if (!response.SecretString) {
        throw new Error('RDS master secret has no SecretString')
    }

    const credentials = JSON.parse(response.SecretString)

    const requiredFields = ['host', 'username', 'password']

    for (const field of requiredFields) {
        if (!credentials[field]) {
            throw new Error(`RDS master secret is missing field: ${field}`)
        }
    }

    return credentials
}

// --------------------------------------------------
// 5. Store application credentials in Secrets Manager
// --------------------------------------------------

const saveDatabaseSecret = async(secretArn, username, password) => {
    const secretValue = JSON.stringify({
        username,
        password
    })

    await secretsManager.send(
        new PutSecretValueCommand({
            SecretId: secretArn,
            SecretString: secretValue
        })
    )
}

// --------------------------------------------------
// 6. Create database users and assign privileges
// --------------------------------------------------

const setupDatabaseUsers = async() => {
        let connection

        try {
            console.log('Retrieving RDS master credentials...')

            const masterCredentials = await getMasterCredentials()

            console.log('Connecting to the RDS database...')

            connection = await mysql.createConnection({
                host: masterCredentials.host,
                port: Number(masterCredentials.port || 3306),
                user: masterCredentials.username,
                password: masterCredentials.password,
                database: process.env.DB_NAME,
                ssl: {
                    ca: readFileSync(new URL('../certs/global-bundle.pem', import.meta.url)),
                    rejectUnauthorized: true
                },
                connectTimeout: 15000
            })

            const databaseName = process.env.DB_NAME

            // Quote the database identifier safely.
            const escapedDatabaseName = `\`${databaseName.replace(/`/g, '``')}\``

        // --------------------------------------------------
        // Runtime account
        // --------------------------------------------------

        console.log('Creating the runtime database account...')

        await connection.query(
            `CREATE USER IF NOT EXISTS '${runtimeUsername}'@'%' IDENTIFIED BY ${connection.escape(runtimePassword)}`
        )

        await connection.query(
            `ALTER USER '${runtimeUsername}'@'%' IDENTIFIED BY ${connection.escape(runtimePassword)}`
        )

        await connection.query(
            `GRANT SELECT, INSERT, UPDATE, DELETE ON ${escapedDatabaseName}.* TO '${runtimeUsername}'@'%'`
        )

        // --------------------------------------------------
        // Migration account
        // --------------------------------------------------

        console.log('Creating the migration database account...')

        await connection.query(
            `CREATE USER IF NOT EXISTS '${migrationUsername}'@'%' IDENTIFIED BY ${connection.escape(migrationPassword)}`
        )

        await connection.query(
            `ALTER USER '${migrationUsername}'@'%' IDENTIFIED BY ${connection.escape(migrationPassword)}`
        )

        await connection.query(
            `GRANT CREATE, SELECT, INSERT, INDEX, REFERENCES ON ${escapedDatabaseName}.* TO '${migrationUsername}'@'%'`
        )

        // --------------------------------------------------
        // Save credentials only after database permissions
        // have been successfully assigned.
        // --------------------------------------------------

        console.log('Saving runtime credentials in Secrets Manager...')

        await saveDatabaseSecret(
            process.env.RUNTIME_DB_SECRET_ARN,
            runtimeUsername,
            runtimePassword
        )

        console.log('Saving migration credentials in Secrets Manager...')

        await saveDatabaseSecret(
            process.env.MIGRATION_DB_SECRET_ARN,
            migrationUsername,
            migrationPassword
        )

        console.log('Database accounts and Secrets Manager credentials created successfully.')
    } finally {
        if (connection) {
            await connection.end()
        }
    }
}

setupDatabaseUsers().catch((error) => {
    console.error('Database administration failed:', error.message)
    process.exitCode = 1
})
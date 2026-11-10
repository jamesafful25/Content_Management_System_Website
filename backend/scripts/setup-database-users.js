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
    'DB_NAME',
    'DB_HOST'
]

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        )
    }
}

// --------------------------------------------------
// 2. Initialize AWS Secrets Manager
// --------------------------------------------------

const secretsManager = new SecretsManagerClient({
    region: process.env.AWS_REGION
})

// --------------------------------------------------
// 3. Retrieve existing credentials or initialize them
// --------------------------------------------------

const getOrCreateDatabaseCredentials = async (
    secretArn,
    defaultUsername
) => {
    try {
        console.log(`Retrieving credentials for ${defaultUsername}...`)

        const response = await secretsManager.send(
            new GetSecretValueCommand({
                SecretId: secretArn
            })
        )

        if (!response.SecretString) {
            throw new Error(
                `Secret has no stored value: ${defaultUsername}`
            )
        }

        const credentials = JSON.parse(response.SecretString)

        if (!credentials.username || !credentials.password) {
            throw new Error(
                `Secret is missing username or password: ${defaultUsername}`
            )
        }

        console.log(`Existing credentials found for ${defaultUsername}.`)

        return credentials

    } catch (error) {
        if (error.name !== 'ResourceNotFoundException') {
            throw error
        }

        console.log(`Initializing credentials for ${defaultUsername}...`)

        const credentials = {
            username: defaultUsername,
            password: crypto.randomBytes(48).toString('base64url')
        }

        await secretsManager.send(
            new PutSecretValueCommand({
                SecretId: secretArn,
                SecretString: JSON.stringify(credentials)
            })
        )

        console.log(`Initial credentials stored for ${defaultUsername}.`)

        return credentials
    }
}

// --------------------------------------------------
// 4. Retrieve RDS master credentials
// --------------------------------------------------

const getMasterCredentials = async () => {
    const response = await secretsManager.send(
        new GetSecretValueCommand({
            SecretId: process.env.RDS_MASTER_SECRET_ARN
        })
    )

    if (!response.SecretString) {
        throw new Error('RDS master secret has no SecretString.')
    }

    const credentials = JSON.parse(response.SecretString)

    if (!credentials.username || !credentials.password) {
        throw new Error(
            'RDS master secret is missing username or password.'
        )
    }

    return credentials
}

// --------------------------------------------------
// 5. Create database accounts and assign permissions
// --------------------------------------------------

const setupDatabaseUsers = async () => {
    let connection

    try {
        // Retrieve or initialize both application credentials.
        const runtimeCredentials = await getOrCreateDatabaseCredentials(
            process.env.RUNTIME_DB_SECRET_ARN,
            'cms_app_user'
        )

        const migrationCredentials = await getOrCreateDatabaseCredentials(
            process.env.MIGRATION_DB_SECRET_ARN,
            'cms_migration_user'
        )

        // Retrieve RDS administrator credentials.
        console.log('Retrieving RDS master credentials...')

        const masterCredentials = await getMasterCredentials()

        // Connect securely to RDS.
        console.log('Connecting to the RDS database...')

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(masterCredentials.port || 3306),
            user: masterCredentials.username,
            password: masterCredentials.password,
            database: process.env.DB_NAME,
            ssl: {
                ca: readFileSync(
                    new URL('../certs/global-bundle.pem', import.meta.url)
                ),
                rejectUnauthorized: true
            },
            connectTimeout: 15000
        })

        const escapedDatabaseName =
            `\`${process.env.DB_NAME.replace(/`/g, '``')}\``

        // --------------------------------------------------
        // 6. Configure runtime database account
        // --------------------------------------------------

        const runtimeUser = connection.escape(
            runtimeCredentials.username
        )

        const runtimePassword = connection.escape(
            runtimeCredentials.password
        )

        console.log('Configuring runtime database account...')

        await connection.query(
            `CREATE USER IF NOT EXISTS ${runtimeUser}@'%' IDENTIFIED BY ${runtimePassword}`
        )

        // Reapply the same stored password to reconcile any drift.
        // This does not generate or rotate the password.
        await connection.query(
            `ALTER USER ${runtimeUser}@'%' IDENTIFIED BY ${runtimePassword}`
        )

        await connection.query(
            `GRANT SELECT, INSERT, UPDATE, DELETE ON ${escapedDatabaseName}.* TO ${runtimeUser}@'%'`
        )

        // --------------------------------------------------
        // 7. Configure migration database account
        // --------------------------------------------------

        const migrationUser = connection.escape(
            migrationCredentials.username
        )

        const migrationPassword = connection.escape(
            migrationCredentials.password
        )

        console.log('Configuring migration database account...')

        await connection.query(
            `CREATE USER IF NOT EXISTS ${migrationUser}@'%' IDENTIFIED BY ${migrationPassword}`
        )

        // Reapply the same stored password; no new password is generated.
        await connection.query(
            `ALTER USER ${migrationUser}@'%' IDENTIFIED BY ${migrationPassword}`
        )

        await connection.query(
            `GRANT CREATE, SELECT, INSERT, INDEX, REFERENCES ON ${escapedDatabaseName}.* TO ${migrationUser}@'%'`
        )

        console.log(
            'Database accounts and permissions configured successfully.'
        )

    } catch (error) {
        console.error(
            'Database administration failed:',
            error.message
        )

        throw error

    } finally {
        if (connection) {
            await connection.end()
        }
    }
}

// --------------------------------------------------
// 8. Execute database setup
// --------------------------------------------------

setupDatabaseUsers().catch(() => {
    process.exitCode = 1
})

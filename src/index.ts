import { Client } from 'pg';
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, PGPORT } =
	process.env;

const portNumber = PGPORT ? parseInt(PGPORT, 10) : 5432; // Use a default port if PGPORT is undefined

const client = new Client({
	host: PGHOST,
	port: portNumber,
	database: PGDATABASE,
	user: PGUSER,
	password: PGPASSWORD,
	ssl: {
		rejectUnauthorized: false, // You might need to set this to true if you have the server's CA certificate
		// If you have the certificate, you would use { ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString() },
	},
});

client.connect();

async function createUsersTable() {
	const res = await client.query(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);

	console.log(res);
}

async function insertUsersTable(
	username: string,
	email: string,
	password: string
) {
	try {
		const insertQuery = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3);
    `;
		const values = [username, email, password];
		const res = await client.query(insertQuery, values);

		console.log(res);
	} catch (error) {
		console.log(error);
	} finally {
		client.end();
	}
}

async function getUser(email: string) {
	const findQuery = `SELECT * FROM users WHERE email = $1`;
	const values = [email];

	try {
		const result = await client.query(findQuery, values);
		if (result.rows.length > 0) {
			console.log('User found: ', result.rows[0]);
			return result;
		} else {
			console.log('No users found');
			return null;
		}
	} catch (error) {
		console.log('error, ', error);
	} finally {
		client.end();
	}
}

// createUsersTable();
// insertUsersTable('saad2', 'saad2@test.com', 'test123');
getUser('saad2@test.com');

import { Pool } from 'pg';

const pool: Pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'authserver',
	password: '',
	port: 5432
});

export const query = (text: string) => {
	return pool.query(text);
}

export const queryValues = (text: string, values: Array<string|number>) => {
	return pool.query(text, values);
}
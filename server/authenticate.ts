import * as db from './database';
import * as argon2 from 'argon2';
import { QueryResult } from 'pg';
import { Request, Response } from 'express';

const addUser = async (username: string, password: string, email: string) => {
	const hashed_password: string = await argon2.hash(password);
	const query: string = 'insert into users (username, password, email) values ($1, $2, $3)';
	return db.queryValues(query, [username, hashed_password, email]);
}

const findUser = async (username: string) => {
	// look for user in the database
	let query: string = "select username, password from users where username=$1";
	return db.queryValues(query, [username]);
}

const parseCreds = (username: string, password: string, res: Response) => {
	if (!username || !password || !username.match(/^[a-zA-Z0-9]{10,48}$/) || !password.match(/^[a-zA_Z0-9]{10,48}$/)) {
		// check for undefined and regex match
		res.status(401).end('incorrect credentials');
		return false;
	}
	return true;
}

export const signUp = async (req: Request, res: Response) => {
	// receive username and password
	const { username, password } = req.body;
	// parse the credentials
	if (!parseCreds(username, password, res)) return;
	// find the user in the database
	const exists: QueryResult = await findUser(username);
	// if user exists
	if (exists.rowCount) {
		// user exists in the database
		res.status(401).end('User already exists');
	} else {
		// user doesn't exist in the database
		const added: QueryResult = await addUser(username, password, 'gavinbrrtt@gmail.com');
		added ? res.status(200).send('check your email') : res.status(401).end('Could not add user');
	}
}

export const signIn = async (req: Request, res: Response) => {
	// receive username and password
	const { username, password } = req.body;
	// parse the credentials
	if (!parseCreds(username, password, res)) return;
	// find the user in the database
	const result: QueryResult = await findUser(username);
	if (result.rowCount) {
		const hashed_password: string = result.rows[0].password;
		const matched = await argon2.verify(hashed_password, password);
		matched ? res.status(200).end('user authed') : res.status(401).end('password does not match');
	} else {
		res.status(401).end('user does not exist');
	}
}
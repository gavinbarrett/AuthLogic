import * as db from './database';

export const setupDB = async () => {
	await db.query("create table if not exists users (username varchar(64), password varchar(128), email varchar(64), time timestamp with time zone default current_timestamp)");
}
import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
	id: serial('id').primaryKey(),
	url: text('url').notNull(),
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	bio: text('bio').default('Hello am 48 year old man from somalia. Sorry for my bed england. I selled my wife for internet connection for play “conter stirk” game.'),
});
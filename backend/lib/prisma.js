import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	port: parseInt(process.env.DATABASE_PORT || "3306"),
	connectionLimit: 10,
	ssl: {
		rejectUnauthorized: false
	},
	connectTimeout: 60000,
	acquireTimeout: 60000,
	timeout: 60000,
	waitForConnections: true,
	queueLimit: 0
});

const prisma = new PrismaClient({ adapter });

export { prisma };
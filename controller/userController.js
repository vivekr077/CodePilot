import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log("Server started at PORT: ", PORT);
})

import { prisma } from "../lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io'
    }
  });

  console.log('Created user:', user);

  const allUsers = await prisma.user.findMany();
  console.log('All users:', JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


import { prisma } from './lib/prisma.js'

async function main() {
  // Create a user (matches current schema: User + Generation)
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'aliceagain@prisma.io'
    }
  });
  console.log('Created user:', user);

  // Optionally create a generation linked to user
  const gen = await prisma.generation.create({
    data: {
      prompt: 'Example prompt',
      language: 'javascript',
      code: '// sample code',
      user: { connect: { id: user.id } }
    }
  });
  console.log('Created generation:', gen);

  // Fetch users with generations
  const allUsers = await prisma.user.findMany({
    include: { generations: true }
  });
  console.log('All users:', JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
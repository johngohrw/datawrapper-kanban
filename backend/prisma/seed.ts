import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'John',
    email: 'john@example.com',
    columns: {
      create: [
        {
          title: 'Backlog',
          tasks: {
            create: [
              {
                title: "Do homework",
                description: "3 pages of maths exercises due tomorrow.."
              }
            ]
          }
        },
      ],
    },
  },
]

async function main() {
  for (const user of userData) {
    const _user = await prisma.user.create({
      data: user,
    })
    console.log(`Created user id ${_user.id} in DB.`)
  }
  console.log("Done seeding.")
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

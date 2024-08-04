import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = [];

  for (let i = 0; i < 1000; i++) {
    users.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
    });
  }

  const result = await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Opsional: lewati jika ada email duplikat
  });

  console.log(`Berhasil memasukkan ${result.count} user`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const products = [];

  for (let i = 0; i < 1000; i++) {
    products.push({
      name: faker.person.fullName(),
      brand: faker.commerce.productName(),
      price: faker.number.int({ min: 1000, max: 10000 }),
    });
  }

  const result = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log(`Berhasil memasukkan ${result.count} product`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import sampleData from "./sample-data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // await prisma.product.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.verificationToken.deleteMany();
  // await prisma.user.deleteMany();

  // // await prisma.product.createMany({ data: sampleData.products });
  // await prisma.user.createMany({ data: sampleData.users });

  // console.log(`Database seeded successfully`);

  for (const name of sampleData.steels) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✅ Seeded ${sampleData.steels.length} categories.`);
}

main();

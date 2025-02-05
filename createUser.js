import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createTestUser() {
  const hashedPassword = await bcrypt.hash("12345sam", 10);

  const organization = await prisma.organization.findFirst();

  if (!organization) {
    console.error("No organization found. Please create one first.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: "samniyo20@gmail.com",
      password: hashedPassword,
      organizationId: organization.id,
    },
  });

  console.log("Test user created:", user);
}

createTestUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

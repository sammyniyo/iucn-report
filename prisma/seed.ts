import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("Admin@123", 10); // Change this password

  const user = await prisma.user.create({
    data: {
      email: "samshakul@gmail.com", // Change to your email
      password: hashedPassword, // Store the hashed password
      role: "admin", // Adjust if your system uses roles
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

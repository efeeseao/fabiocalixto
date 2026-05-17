import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 A iniciar o seed da base de dados...");

  const ADMIN_EMAIL = process.env.ADMIN_INITIAL_EMAIL || "admin@gmail.com";
  const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "Admin@12345";
  const ADMIN_NAME = process.env.ADMIN_INITIAL_NAME || "Admin";

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("✅ A conta de administrador já se encontra configurada.");
      return;
    }

    console.log("⏳ A gerar credenciais do administrador...");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await prisma.user.create({
      data: {
        id: ADMIN_EMAIL,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: "ADMIN",
        status: "APPROVED",
        accounts: {
          create: [
            {
              id: `credential-${Date.now()}`,
              accountId: ADMIN_EMAIL,
              providerId: "credential",
              password: hashedPassword,
            },
          ],
        },
      },
    });

    console.log("🚀 Administrador principal criado com sucesso!");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD} (Lembra-te de a alterar!)`);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await pool.end();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await pool.end();
    await prisma.$disconnect();
    process.exit(1);
  });

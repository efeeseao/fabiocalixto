import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  console.log("🌱 A iniciar o seed da base de dados...");

  const ADMIN_EMAIL = process.env.ADMIN_INITIAL_EMAIL || "admin@gmail.com";
  const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "Admin@12345";
  const ADMIN_NAME = process.env.ADMIN_INITIAL_NAME || "Admin";

  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ADMIN_INITIAL_EMAIL || !process.env.ADMIN_INITIAL_PASSWORD)
  ) {
    console.error(
      "❌ Em produção, define ADMIN_INITIAL_EMAIL e ADMIN_INITIAL_PASSWORD (não são usadas credenciais por defeito).",
    );
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 10) {
    console.error("❌ A password do administrador deve ter pelo menos 10 caracteres.");
    process.exit(1);
  }

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("✅ A conta de administrador já se encontra configurada.");
      return;
    }

    console.log("⏳ A gerar credenciais do administrador...");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

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
    if (!process.env.ADMIN_INITIAL_PASSWORD) {
      console.log("   Password: (valor por defeito — altera-a imediatamente!)");
    }
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
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

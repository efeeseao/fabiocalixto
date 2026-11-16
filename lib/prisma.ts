import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  // MySQL 8 usa `caching_sha2_password`: sem TLS, o driver precisa de obter a
  // chave pública do servidor. Sem isto, após um reinício do MySQL todas as
  // ligações falham ("RSA public key is not available client side").
  allowPublicKeyRetrieval: true,
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

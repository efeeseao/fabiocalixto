import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const appUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

// Aceita o domínio com e sem "www." (o nginx serve ambos).
function originsFor(url: string | undefined) {
  if (!url) return undefined;
  try {
    const { protocol, host } = new URL(url);
    const bare = host.replace(/^www\./, "");
    return [`${protocol}//${bare}`, `${protocol}//www.${bare}`];
  } catch {
    return [url];
  }
}

export const auth = betterAuth({
  baseURL: appUrl,
  trustedOrigins: originsFor(appUrl),
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    additionalFields: {
      // `input: false` impede que um cliente defina estes campos ao criar
      // conta (ex.: role: "ADMIN") — evita escalada de privilégios.
      status: {
        type: "string",
        input: false,
        defaultValue: "PENDING",
      },
      role: {
        type: "string",
        input: false,
        defaultValue: "USER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // O CMS é privado: as contas são criadas apenas via seed / base de dados.
    disableSignUp: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 12);
      },
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // renova diariamente
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [nextCookies()],
});

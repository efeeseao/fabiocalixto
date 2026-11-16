import { z } from "zod";

/** URL http(s) opcional — bloqueia esquemas perigosos como `javascript:`. */
export const optionalHttpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "URL inválido")
  .refine((v) => {
    if (v === "") return true;
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  }, "URL inválido")
  .optional()
  .transform((v) => (v ? v : null));

export const idSchema = z.string().trim().min(1).max(191);

export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Dados inválidos.";
}

import { z } from "zod";

// =====================================================
// ENV SCHEMA DEFINITION
// =====================================================

const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL deve ser uma URL válida")
    .refine(
      (url) => url.startsWith("postgresql://"),
      "DATABASE_URL deve usar protocolo postgresql://"
    ),

  // Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET deve ter pelo menos 32 caracteres"),

  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL deve ser uma URL válida"),

  // JWT Configuration
  JWT_EXPIRATION: z
    .string()
    .optional()
    .default("86400"),

  REFRESH_TOKEN_EXPIRATION: z
    .string()
    .optional()
    .default("2592000"),

  // Application
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),

  DEBUG: z
    .string()
    .optional()
    .default("false"),
});

// =====================================================
// VALIDATION
// =====================================================

/**
 * Valida as variáveis de ambiente e retorna um objeto tipado
 *
 * Lança um erro detalhado se alguma variável obrigatória estiver faltando
 * ou se alguma variável tiver formato inválido.
 */
function validateEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    console.error(
      "\n❌ Variáveis de ambiente inválidas:\n\n" +
        errors +
        "\n\nVerifique seu arquivo .env e tente novamente.\n"
    );

    throw new Error("Validação de variáveis de ambiente falhou");
  }

  return result.data;
}

// =====================================================
// EXPORTS
// =====================================================

// Valida e exporta as variáveis de ambiente
// Isso acontece uma única vez no startup da aplicação
export const env = validateEnv();

// Type export para uso em outros arquivos
export type Env = typeof env;

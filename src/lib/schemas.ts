import { z } from "zod";

// =====================================================
// AUTH SCHEMAS
// =====================================================

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome pode ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z
    .string()
    .min(8, "Confirmação de senha é obrigatória"),
  targetCourse: z
    .string()
    .optional()
    .describe("Curso desejado (ex: Medicina, Engenharia)")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token é obrigatório"),
});

// =====================================================
// USER SCHEMAS
// =====================================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome pode ter no máximo 100 caracteres")
    .optional(),
  targetCourse: z
    .string()
    .optional(),
  dailyStudyHours: z
    .number()
    .min(0.5, "Mínimo 30 minutos")
    .max(12, "Máximo 12 horas")
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter letra maiúscula")
    .regex(/[a-z]/, "Deve conter letra minúscula")
    .regex(/[0-9]/, "Deve conter número")
    .regex(/[^A-Za-z0-9]/, "Deve conter caractere especial"),
  confirmPassword: z
    .string()
    .min(8, "Confirmação é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Nova senha e confirmação não conferem",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Nova senha deve ser diferente da atual",
  path: ["newPassword"],
});

// =====================================================
// QUESTION SCHEMAS
// =====================================================

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Texto da opção é obrigatório"),
});

export const submitQuestionAnswerSchema = z.object({
  questionId: z
    .string()
    .uuid("ID da questão inválido"),
  selectedOptionId: z
    .string()
    .min(1, "Opção selecionada é obrigatória"),
});

export const questionFilterSchema = z.object({
  subjectId: z.string().optional(),
  difficulty: z
    .number()
    .min(1)
    .max(5)
    .optional(),
  page: z
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});

// =====================================================
// ESSAY SCHEMAS
// =====================================================

export const submitEssaySchema = z.object({
  theme: z
    .string()
    .min(5, "Tema deve ter no mínimo 5 caracteres")
    .max(200, "Tema pode ter no máximo 200 caracteres"),
  content: z
    .string()
    .min(100, "Redação deve ter no mínimo 100 caracteres")
    .max(5000, "Redação pode ter no máximo 5000 caracteres"),
});

// =====================================================
// STUDY PLAN SCHEMAS
// =====================================================

export const createStudyPlanSchema = z.object({
  subjectId: z
    .string()
    .uuid("ID da matéria inválido"),
  date: z
    .string()
    .datetime("Data inválida"),
  durationMin: z
    .number()
    .int()
    .min(15, "Duração mínima 15 minutos")
    .max(480, "Duração máxima 8 horas"),
});

// =====================================================
// TYPE EXPORTS (Para usar em componentes)
// =====================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SubmitQuestionAnswer = z.infer<typeof submitQuestionAnswerSchema>;
export type SubmitEssay = z.infer<typeof submitEssaySchema>;
export type CreateStudyPlan = z.infer<typeof createStudyPlanSchema>;

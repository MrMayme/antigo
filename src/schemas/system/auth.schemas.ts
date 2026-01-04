import { z } from 'zod'

export const authSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Usuário é obrigatório")
    .min(3, "Usuário deve ter no mínimo 3 caracteres"),

  password: z
    .string()
    .trim()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export const registerAuthSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Usuário é obrigatório")
    .min(3, "Usuário deve ter no mínimo 3 caracteres"),

  password: z
    .string()
    .trim()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),

  email: z
    .email("Email inválido")
    .trim()
    .toLowerCase()
})

export const refreshAuthSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(1,"Refresh token é obrigatório"),
})

export type AuthInput = z.infer<typeof authSchema>

export type RegisterAuthInput = z.infer<typeof registerAuthSchema>

export type RefreshAuthInput = z.infer<typeof refreshAuthSchema>
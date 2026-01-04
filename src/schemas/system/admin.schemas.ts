import { Role } from '@prisma/client'
import { z } from 'zod'

export const paramsUserByAdminSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Id ")
})

export const createUserByAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Usuário deve ter no mínimo 3 caracteres"),
  
  password: z
    .string()
    .trim()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  
  email: z
    .email("Email inválido")
    .trim()
    .lowercase(),
  
  role: z
    .nativeEnum(Role)
})

export const updateUserByAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Usuário deve ter no mínimo 3 caracteres")
    .optional(),
  
  password: z
    .string()
    .trim()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),
  
  email: z
    .email("Email inválido")
    .trim()
    .lowercase()
    .optional(),
  
  role: z
    .nativeEnum(Role)
    .optional()
})
/*.refine(
    data => Object.keys(data).length > 0,
    {
      message: 'Informe ao menos um campo para atualização',
    }
  )*/
.transform(data =>
    Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
  )

export type ParamsUserByAdminInput = z.infer<typeof paramsUserByAdminSchema>

export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>

export type UpdateUserByAdminInput = z.infer<typeof updateUserByAdminSchema>
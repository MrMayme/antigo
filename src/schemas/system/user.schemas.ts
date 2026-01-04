import { z } from 'zod'

export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Usuário é obrigatório")
    .min(3, "Usuário deve ter no mínimo 3 caracteres")
    .optional(),
  
  password: z
    .string()
    .trim()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),
  
  email: z
    .email("Email inválido")
    .trim()
    .lowercase()
    .optional(),
})
.refine(
    data => Object.keys(data).length > 0,
    {
      message: 'Informe ao menos um campo para atualização',
    }
)
.transform(data =>
    Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
)

export type UpdateUserInput = z.infer<typeof updateUserSchema>
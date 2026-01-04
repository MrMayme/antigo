import type { Request, Response } from "express";
//import { Role } from "@prisma/client";
import { AppError } from "../../errors/AppError.js";
import { validateSchema } from "../../utils/system/validateSchema.js";
import { UserService } from "../../services/system/user.service.js";
import { updateUserSchema, type UpdateUserInput } from "../../schemas/system/user.schemas.js";

export async function getUserController(req: Request, res: Response) {
  const userId = req.userId
  console.log("req.userId:a ", req.userId)

  if (!userId) {
    throw new AppError('Usuário não autenticado', 401)
  }

  const user = await UserService.getUserById(userId)

  return res.json({ user })
}

export async function updateUserController(req: Request<{},{}, UpdateUserInput>, res: Response) {
  const userId = req.userId

  if (!userId) {
    throw new AppError('Usuário não autenticado', 401)
  }

  const data = validateSchema(updateUserSchema, req.body)
  console.log("DATA: ", data)

  const user = await UserService.updatetUserById(userId, data)

  return res.json({ user })
}
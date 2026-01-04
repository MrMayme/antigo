import type { Request, Response } from "express";
//import { Role } from "@prisma/client";
import { AppError } from "../../errors/AppError.js";
import { createUserByAdminSchema, updateUserByAdminSchema, type CreateUserByAdminInput, type ParamsUserByAdminInput , type UpdateUserByAdminInput } from "../../schemas/system/admin.schemas.js";
import { validateSchema } from "../../utils/system/validateSchema.js";
import { AdminService } from "../../services/system/admin.service.js";

export async function getUsersByAdminController(_req: Request, res: Response) {

  const users = await AdminService.getUsersByAdmin()

  return res.status(200).json({ users })
}

export async function createUserByAdminController(req: Request<{}, {}, CreateUserByAdminInput>, res: Response) {
  
  const adminId = Number(req.userId)
  if (!Number.isInteger(adminId)) {
    throw new AppError('ID inválido', 400)
  }

  const data = validateSchema(createUserByAdminSchema, req.body)

  const user = await AdminService.createUserByAdmin(adminId,data)

  return res.status(200).json({ user })
}

export async function updateUserByAdminController(req: Request<ParamsUserByAdminInput, {}, UpdateUserByAdminInput>, res: Response) {
  const userId = Number(req.params.id)
  
  if (!Number.isInteger(userId)) {
    throw new AppError('ID inválido', 400)
  }
  
  const adminId = Number(req.userId)
  if (!Number.isInteger(adminId)) {
    throw new AppError('ID inválido', 400)
  }

  const data = validateSchema(updateUserByAdminSchema, req.body)

  const user = await AdminService.updateUserByAdmin(adminId, userId, data)

  return res.status(200).json({ user })
}

export async function deleteUserByAdminController(req: Request<ParamsUserByAdminInput, {}, {}>, res: Response) {  
  const adminId = Number(req.userId)
  
  if (!Number.isInteger(adminId)) {
    throw new AppError("ID inválido", 400)
  }
  
  const userId = Number(req.params.id)
  
  if (!Number.isInteger(userId)) {
   throw new AppError('ID inválido', 400)
  }

  await AdminService.deleteUserByAdmin(adminId, userId)

  return res.status(200).json({ message: "Usuário deletado"})
}
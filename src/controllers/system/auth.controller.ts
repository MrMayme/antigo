import type { Request, Response } from "express";
//import { Role } from "@prisma/client";
import { authSchema, registerAuthSchema, 
  type AuthInput, type RegisterAuthInput, 
} from "../../schemas/system/auth.schemas.js";
import { validateSchema } from "../../utils/system/validateSchema.js";
import { AuthService } from "../../services/system/auth.service.js";
import { AppError } from "../../errors/AppError.js";

export async function authController(req: Request<{}, {}, AuthInput>,res: Response) {
  
  const data = validateSchema(authSchema, req.body)
  
  const { accessToken, refreshToken, user } = await AuthService.loginUser(data)
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  })

  res.json({
    accessToken,
    user,
  })

}

export async function registerAuthController(req: Request<{}, {}, RegisterAuthInput>,res: Response) {
  
  const data = validateSchema(registerAuthSchema, req.body)
  
  const user = await AuthService.createUser(data)
  
  return res.status(201).json({ message: "Usuário salvo", user })
}

export async function refreshAuthController(req: Request, res: Response) {
   
  const refreshToken = req.cookies?.refreshToken
  console.log("refreshToken: ", refreshToken)
  if (!refreshToken) {
    throw new AppError('Refresh token não fornecido', 401)
  }

  const { accessToken } = await AuthService.refreshUser(refreshToken)
  
  return res.json({ accessToken })

}

export async function logoutAuthController(req: Request, res: Response) {
  console.log("1->logout->refreshToken: ", req.cookies?.refreshToken)
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/auth/refresh',
  })
  console.log("2->logout->refreshToken: ", req.cookies?.refreshToken)

  return res.status(200).json({ message: 'Logout realizado com sucesso' })

}
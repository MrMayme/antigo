import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma.js'
import type { AuthInput, RegisterAuthInput } from '../../schemas/system/auth.schemas.js'
import { AppError } from '../../errors/AppError.js'
import { hashPassword } from '../../utils/system/password.js'
import { buildUCreateAuditChanges } from '../../utils/system/buildAuditChanges.js'
import { AuditAction } from '@prisma/client'
import { AuditService } from './audit.service.js'


export class AuthService {
  static async createUser(data: RegisterAuthInput) {

    return prisma.$transaction(async tx => {

      const { password, ...auditData } = data
      const { username, email } = auditData
  
      const existingUser = await tx.user.findUnique({ where: { username } })
      if (existingUser) {
        throw new AppError("Usuário já existe", 409)
      }
  
      const hashedPassword = await hashPassword(password)
    
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true
        },
      })
      
      const changes = buildUCreateAuditChanges(auditData)

      await AuditService.log({
        entity: 'User',
        userId: user.id,
        action: AuditAction.CREATE,
        entityId: user.id,
        changes,
      }, tx)
      
      return user
    })
  }

  static async loginUser(data: AuthInput) {
    const { username, password } = data

    const existingUser = await prisma.user.findUnique({ where: { username } })

    if (!existingUser) {
      throw new AppError("Usuário ou senha inválidos", 401)
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password)

    if (!passwordMatch) {
      throw new AppError("Usuário ou senha inválidos", 401)
    }
    
    const accessToken = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )
    console.log("accessToken: ", accessToken)
    const refreshToken = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )
    console.log("refreshToken: ", refreshToken)
    const object = { 
      accessToken, 
      refreshToken,
      user: {
        id: existingUser.id,
        username: existingUser.username,
      },
    }
    
    return object
  }

  static async refreshUser(refreshToken: string) {
    let payload: { userId: number }
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { userId: number }
    }catch{
      throw new AppError("Refresh token inválido ou expirado", 401)
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 401)
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    return { accessToken }

  }

}
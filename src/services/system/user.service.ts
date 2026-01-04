import prisma from '../../lib/prisma.js'
import { AppError } from '../../errors/AppError.js'
import type { UpdateUserInput } from '../../schemas/system/user.schemas.js'
import { AuditAction } from '@prisma/client'
import { AuditService } from './audit.service.js'
import { buildUpdateAuditChanges } from '../../utils/system/buildAuditChanges.js'

export class UserService {
  static async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    return user
  }

  static async updatetUserById(userId: number, data: UpdateUserInput) {

    return prisma.$transaction(async tx => {

      const existingUser = await tx.user.findUnique({
        where: { id: userId },
      })
  
      if (!existingUser) {
        throw new AppError('Usuário não encontrado', 404)
      }
      
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      })

      const changes = buildUpdateAuditChanges(existingUser, data)
        
      if (Object.keys(changes).length > 0) {
      await AuditService.log({
        entity: 'User',
        userId: userId,
        action: AuditAction.UPDATE,
        entityId: userId,
        changes,
      }, tx)
      }

      return updatedUser
      
    })

  }
  
}

import prisma from '../../lib/prisma.js'
import type { CreateUserByAdminInput, UpdateUserByAdminInput } from '../../schemas/system/admin.schemas.js'
import { AppError } from '../../errors/AppError.js'
import { hashPassword } from '../../utils/system/password.js'
import { buildUCreateAuditChanges, buildUpdateAuditChanges, buildDeleteAuditChanges } from '../../utils/system/buildAuditChanges.js'
import { AuditService } from './audit.service.js'
import { AuditAction } from '@prisma/client'

export class AdminService {
 
  static async getUsersByAdmin() {
      
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users
  }

  static async createUserByAdmin(adminId: number, data: CreateUserByAdminInput) {

    return prisma.$transaction(async tx => {
      
      const { username, email, password, role } = data

      const existingUser = await tx.user.findUnique({
        where: { username },
      })
  
      if (existingUser) {
        throw new AppError('Usuário já existe', 409)
      }
  
      const hashedPassword = await hashPassword(password)

      const createdUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role
        },
        select: {
          id: true
        },
      },
      )
  
      const changes = buildUCreateAuditChanges(data)
  
      await AuditService.log({
        entity: 'User',
        userId: adminId,
        action: AuditAction.CREATE,
        entityId: createdUser.id,
        changes,
      }, tx)
  
      return createdUser
    })

  }

  static async updateUserByAdmin(adminId: number, userId: number, data: UpdateUserByAdminInput) {
    
    return prisma.$transaction(async tx => {

      const existingUser = await tx.user.findUnique({
        where: { id: userId },
      })
  
      if (!existingUser) {
        throw new AppError('Usuário não encontrado', 404)
      }
  
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: data,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      )
  
      const changes = buildUpdateAuditChanges(existingUser, data)
  
      if (Object.keys(changes).length > 0) {
      await AuditService.log({
        entity: 'User',
        userId: adminId,
        action: AuditAction.UPDATE,
        entityId: userId,
        changes,
      }, tx)
      }
  
      return updatedUser
    })
  }
  //falta testar com auditlog, changes não estou usando no delete
  static async deleteUserByAdmin(adminId: number, userId: number): Promise<void> {
    if (adminId === userId) {
      throw new AppError('Administrador não pode deletar a si mesmo', 403)
    }
    
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      }
    })

    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404)
    }

    await prisma.$transaction(async tx => {
      
      await prisma.user.delete({
        where: { id: userId }
      })
  
      const changes = buildDeleteAuditChanges(existingUser)

      await AuditService.log({
        entity: 'User',
        userId: adminId,
        action: AuditAction.DELETE,
        entityId: userId,
        changes,
      }, tx)
    })

  }

}
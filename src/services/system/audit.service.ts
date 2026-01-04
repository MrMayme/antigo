import { AuditAction, Prisma, PrismaClient } from '@prisma/client'
import prisma from '../../lib/prisma.js'

interface AuditLogInput {
  entity: string
  userId?: number
  action: AuditAction
  entityId: number
  changes: Record<string, { old: any, new: any }>
}

export class AuditService {
  static async log(data: AuditLogInput, prismaClient: Prisma.TransactionClient | PrismaClient = prisma) {
    const auditData: any = {
      entity: data.entity,
      userId: data.userId,
      action: data.action,
      entityId: data.entityId,
      changes: data.changes,
    }
    
    if(data.userId !== undefined) {
      auditData.userId = data.userId
    }

    await prismaClient.auditLog.create({
      data: auditData      
    })
  }
}
import type { Request, Response, NextFunction } from 'express'
import prisma from '../../lib/prisma.js'


export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId!

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado' })
  }

  return next()
}
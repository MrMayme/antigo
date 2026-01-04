import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: number
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  console.log("authHeader: ", req.headers)
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token malformado' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    req.userId = payload.userId
    
    return next()
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}
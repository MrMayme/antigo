import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../../errors/AppError.js'
import { ValidationError } from '../../errors/ValitadionError.js'

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
        errors: err.errors,
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
        message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    message: 'Erro interno do servidor',
  })
}
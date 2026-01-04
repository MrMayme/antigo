import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../../errors/AppError.js'

export function validateNumericParam(paramName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log("paramName: ", paramName)
    const value = Number(req.params[paramName])

    if (!Number.isInteger(value) || value <= 0) {
      throw new AppError(`Parâmetro inválido`, 400)
    }

    next()
  }
}
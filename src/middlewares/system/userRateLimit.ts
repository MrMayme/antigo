import rateLimit from 'express-rate-limit'
import type { Request } from 'express'

export const rateLimitByUser = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                // 100 req por usuário
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: Request) => {
    // Se estiver autenticado → limita por usuário
    if (req.userId) {
      return `user:${req.userId}`
    }

    // Senão → limita por IP
    return req.ip ?? 'unknown'
  },

  handler: (req, res) => {
    const key = req.userId ? `user:${req.userId}` : req.ip

    console.warn(
      `[RATE LIMIT] Blocked key=${key} route=${req.originalUrl}`
    )

    res.status(429).json({
      message: 'Muitas requisições. Tente novamente mais tarde.'
    })
  }
})
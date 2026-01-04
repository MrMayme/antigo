import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // até 5 tentativas
  message: { message: 'Muitas tentativas de login, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,                   // até 10 registros por IP
  message: { message: 'Muitas tentativas de registro, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,                   // até 20 requisições
  message: { message: 'Muitas tentativas de refresh, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})
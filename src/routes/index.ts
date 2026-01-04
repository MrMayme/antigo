import { Router } from 'express'
import apiRoutes from './api.routes.js'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/api', apiRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/admin', adminRoutes)

export default router
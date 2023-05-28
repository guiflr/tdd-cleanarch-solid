import express from 'express'
import middlewares from '../config/middlewares'
import { signupRoutes } from '../routes/signup-routes'

const app = express()

middlewares(app)
app.use('/api', signupRoutes)

export default app

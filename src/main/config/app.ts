import express from 'express'
import middlewares from '../config/middlewares'
import signupRoutes from '../routes/signup-routes'

const app = express()

middlewares(app)

signupRoutes(app)

export default app

import express from 'express'
import middlewares from '../config/middlewares'
import { routes } from '../routes'

const app = express()

middlewares(app)

const mainRouter = express.Router()

app.use('/api', mainRouter)

routes(mainRouter)

export default app

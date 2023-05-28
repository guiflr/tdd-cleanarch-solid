import { type Request, type Response, Router } from 'express'

const signupRoutes = Router()

signupRoutes.post('/signup', (req: Request, res: Response) => {
  res.json({ ok: true })
})

export { signupRoutes }

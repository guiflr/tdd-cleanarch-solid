import type { Router } from 'express'
import signupRoutes from './signup-routes'

export const routes = (route: Router): void => {
  signupRoutes(route)
}

import { Router, Request, Response } from 'express'

const router: Router = Router()

const healthCheck = (req: Request, res: Response) => {
  return res.send({ status: 'OK', version: '1.0' })
}

router.get('/health-check', healthCheck)

export default {
  router
}

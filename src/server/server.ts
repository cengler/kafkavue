import express from 'express'
import bodyParser from 'body-parser'
// @ts-ignore
import cors from 'cors'
import hc from './routes/health-check'

const startServer = () => {
  console.log('Start')
  const PORT = process.env.PORT || 3000
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
  })

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(hc.router)

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
    console.log(`  App running at:\n  - Local:   http://localhost:${PORT}/health-check`)
  })
}

// startServer()

export default {
  startServer
}

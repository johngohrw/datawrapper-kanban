import express from 'express'

const app = express()
const APP_PORT_NUMBER = 3000

app.use(express.json())

const server = app.listen(APP_PORT_NUMBER, () =>
    console.log(`Server up at: http://localhost:${APP_PORT_NUMBER}`),
)

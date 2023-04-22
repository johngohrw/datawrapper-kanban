import express from 'express'

const app = express()
const APP_PORT_NUMBER = 3000

app.use(express.json())

// Hello World get request
app.get('/test', async (req, res) => {
    const result = {
        Hello: "world"
    }
    res.json(result)
})

const server = app.listen(APP_PORT_NUMBER, () =>
    console.log(`Server up at: http://localhost:${APP_PORT_NUMBER}`),
)

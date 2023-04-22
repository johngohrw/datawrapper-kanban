import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient({
    errorFormat: "minimal"
})

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

// get all users
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

// get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
})

// get all columns
app.get('/columns', async (req, res) => {
    const columns = await prisma.column.findMany()
    res.json(columns)
})

const server = app.listen(APP_PORT_NUMBER, () =>
    console.log(`Server up at: http://localhost:${APP_PORT_NUMBER}`),
)

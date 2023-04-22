import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import { getGeneralizedPrismaErrorMessage } from './utils'

const prisma = new PrismaClient({
    errorFormat: "minimal"
})

const app = express()
const APP_PORT_NUMBER = 3000

app.use(express.json())
app.use(cors())

// sign up
app.post(`/signup`, async (req, res) => {
    const { name, email, columns } = req.body
    const columnsData = columns?.map((col: Prisma.ColumnCreateInput) => {
        return { title: col?.title, tasks: [] }
    })
    const userCount = await prisma.user.count({
        where: { email }
    })
    if (userCount > 0) {
        res.json({ error: `The email ${email} is already registered, please sign in instead.` })
    } else {
        const result = await prisma.user.create({
            data: {
                name,
                email,
                columns: {
                    create: columnsData,
                },
            },
        })
        res.json(result)
    }
})

// log in
app.post(`/login`, async (req, res) => {
    const { email } = req.body
    let user = await prisma.user.findUnique({
        where: { email },
    })
    res.json(user || { error: `The email ${email} does not exist in our records` })
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

// get all columns for a particular user
app.get('/columns/:userId', async (req, res) => {
    const { userId } = req.params
    const columns = await prisma.column.findMany({
        where: { userId: parseInt(userId) },
    })
    res.json(columns)
})

// get all tasks and columns for a particular user
app.get('/board/:userId', async (req, res) => {
    const { userId } = req.params
    const columns = await prisma.column.findMany({
        where: { userId: parseInt(userId) },
    })
    const tasks = await prisma.task.findMany({
        where: {
            columnId: {
                in: columns.map(column => column.id)
            }
        },
    })
    res.json({ tasks, columns })
})

// create new column for a user
app.post(`/column`, async (req, res) => {
    const { title, userId } = req.body
    try {
        const result = await prisma.column.create({
            data: {
                title,
                user: { connect: { id: userId } },
            },
        })
        res.json(result)
    } catch (error) {
        res.json({ error: `user with ID ${userId} does not exist in the database.` })
    }
})

// create new task for a particular column
app.post(`/task`, async (req, res) => {
    const { title, description, columnId } = req.body
    try {
        const result = await prisma.task.create({
            data: {
                title,
                description,
                column: { connect: { id: columnId } },
            },
        })
        res.json(result)
    } catch (error) {
        res.json({ error: getGeneralizedPrismaErrorMessage(error) })
    }
})

// delete a task
app.delete(`/task/:id`, async (req, res) => {
    const { id } = req.params
    try {
        const task = await prisma.task.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(task)
    } catch (error) {
        res.json({ error: `task with ID ${id} does not exist in the database.` })
    }
})

// delete a column
app.delete(`/column/:id`, async (req, res) => {
    const { id } = req.params
    try {
        const column = await prisma.column.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(column)
    } catch (error) {
        res.json({ error: `column with ID ${id} does not exist in the database.` })
    }
})

const server = app.listen(APP_PORT_NUMBER, () =>
    console.log(`Server up at: http://localhost:${APP_PORT_NUMBER}`),
)

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
morgan.token('body', (req, res) => {
    if (req.method !== 'POST') return " "
    return JSON.stringify(req.body)
})
app.use(express.json())
app.use(cors())
app.use(morgan("tiny :body"))
app.use(express.static('dist'))
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info',(request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
<br /><p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(p => p.id !== id)

    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.number) {
        return response.status(400).json({
            error: "except number property"
        })
    }
    if (!body.name) {
        return response.status(400).json({
            error: "except name property"
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const id = String(Math.floor(Math.random() * 2000000))

    const person = {
        number: body.number,
        name: body.name,
        id
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT|| 3001

app.listen(PORT)
console.log(`Server listening ${PORT} port`)
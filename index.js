const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/persons')
morgan.token('body', (req, res) => {
    if (req.method !== 'POST') return " "
    return JSON.stringify(req.body)
})
app.use(express.json())
app.use(cors())
app.use(morgan("tiny :body"))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(res => response.json(res))
})
app.get('/info',async (request, response) => {
    //const count = Person.find({}).then(res => res.length).then(r => r)
    const count = await Person.countDocuments({}).then(res => res)
    response.send(`<p>Phonebook has info for ${count} people</p>
<br /><p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(res => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response,next ) => {
    const body = request.body
    if (!body.number) {
        return response.status(400).json({
            error: "except number property"
        })
    }
    const createPerson = new Person({
        name: body.name,
        number: body.number
    })
    const error  = createPerson.validateSync()
    console.log(error)
    if (error) next(error)
    createPerson.save().then(res => response.json(res))
        .catch(err => next(err))
})
app.put('/api/persons/:id', (request, response,next) => {
    const  body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true,
    context: 'query'})
        .then(res => response.json(res))
        .catch(err => next(err))
})
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return  response.status(400).send({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT|| 3001

app.listen(PORT)
console.log(`Server listening ${PORT} port`)
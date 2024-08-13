const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
.then(res => console.log('connected to mongoDb'))
.catch(err => console.log('error connect to mongoDb', err))

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function (x) {
                return /\d{2}-\d{6}|\d{3}-\d{5}/.test(x)
            },
            message: props => `${props.value} is not valid a phone number`
        }
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
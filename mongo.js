const mongoose = require('mongoose')
require('dotenv').config()
const [ name, number] = process.argv.length === 4 ? process.argv.slice(2) : [null, null]



const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

if (!name || !number) {
    return getAllUsers()
}

const person = new Person({
    name,
    number
})

person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})


function getAllUsers  ()  {
    Person.find({}).then(res => {
        console.log('phonebook');
        for (const pers of res) {
            console.log(`${pers.name} ${pers.number}`)
        }
        mongoose.connection.close()
    }).catch(err => console.log(err))
}
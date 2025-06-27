import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/person.js';

// let persons = [
//     {
//         id: '1',
//         name: 'Arto Hellas',
//         number: '040-123456',
//     },
//     {
//         id: '2',
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//     },
//     {
//         id: '3',
//         name: 'Dan Abramov',
//         number: '12-43-234345',
//     },
//     {
//         id: '4',
//         name: 'Mary Poppendieck',
//         number: '39-23-6423122',
//     },
// ];

const app = express();
const {PORT} = process.env;
let persons = [];

morgan.token('body', request => JSON.stringify(request.body));

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (_, response) =>
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
);

app.get('/api/persons', (_, response) => {
    Person.find({}).then(persons => response.json(persons));
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findById(id).then(person => response.json(person));
    // const person = persons.find(p => p.id === id);
    // if (!person) return response.status(404).end();
    // response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body;
    if (!name || !number) return response.status(400).json({error: 'name or number missing'});
    // const nameExists = persons.find(p => p.name === name);
    // if (nameExists) return response.status(409).json({error: 'name must be unique'});
    // const person = {name, number, id: crypto.randomUUID()};
    // persons.push(person);
    // response.json(person);
    const person = new Person({name, number});
    person.save().then(savedPerson => response.json(savedPerson));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

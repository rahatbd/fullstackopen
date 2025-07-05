import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/person.js';

// let persons = [
//     {
//         name: 'Arto Hellas',
//         number: '040-123456',
//         id: '1',
//     },
//     {
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//         id: '2',
//     },
//     {
//         name: 'Dan Abramov',
//         number: '12-43-234345',
//         id: '3',
//     },
//     {
//         name: 'Mary Poppendieck',
//         number: '39-23-6423122',
//         id: '4',
//     },
// ];

const app = express();
const {PORT} = process.env;

morgan.token('body', request => JSON.stringify(request.body));

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (_, response, next) => {
    Person.find({})
        .then(persons =>
            response.send(`
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
            `)
        )
        .catch(error => next(error));
});

app.get('/api/persons', (_, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (!person) return response.status(404).end();
            response.json(person);
        })
        .catch(error => next(error));
});

// app.put('/api/persons/:id', (request, response, next) => {
//     const {name, number} = request.body;
//     Person.findById(request.params.id)
//         .then(person => {
//             if (!person) return response.status(404).end();
//             person.name = name;
//             person.number = number;
//             return person.save().then(updatedPerson => response.json(updatedPerson));
//         })
//         .catch(error => next(error));
// });

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;
    Person.findByIdAndUpdate(request.params.id, {name, number}, {new: true})
        .then(updatedPerson => {
            if (!updatedPerson) return response.status(404).end();
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            if (!result) return response.status(404).end();
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const {name, number} = request.body;
    if (!name?.trim() || !number?.trim()) return response.status(400).json({error: 'name or number missing'});
    Person.findOne({name})
        .then(existingPerson => {
            if (existingPerson) return response.status(409).json({error: 'name must be unique'});
            const person = new Person({name, number});
            return person.save().then(savedPerson => response.json(savedPerson));
        })
        .catch(error => next(error));
});

const unknownEndpoint = (_, response) => response.status(404).send({error: 'unknown endpoint'});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') return response.status(400).send({error: 'malformatted id'});
    next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

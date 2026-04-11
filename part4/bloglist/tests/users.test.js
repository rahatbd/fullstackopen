import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import {beforeEach, describe, test, after} from 'node:test';
import {strictEqual} from 'node:assert';

const api = supertest(app);

const usersInDB = async () => {
    const usersDB = await User.find({});
    return usersDB.map(user => user.toJSON());
};

describe('testing users api', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('create a new user', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen',
        };
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(response.body.name, newUser.name);
        strictEqual(response.body.username, newUser.username);
        strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    });

    test('user without username is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('user without password is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('user with username less than 3 characters is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            name: 'Matti Luukkainen',
            username: 'ml',
            password: 'salainen',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('user with password less than 3 characters is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'ml',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('user with username not unique is not created', async () => {
        const newUser = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtStart = await usersInDB();
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

after(async () => {
    await mongoose.connection.close();
});

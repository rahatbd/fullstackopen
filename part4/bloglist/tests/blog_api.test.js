import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ok, strictEqual} from 'node:assert';
import {beforeEach, describe, test, after} from 'node:test';
import app from '../app.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';

const api = supertest(app);

const blogs = [
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    },
];

const blogsInDB = async () => {
    const blogsDB = await Blog.find({});
    return blogsDB.map(blog => blog.toJSON());
};

const usersInDB = async () => {
    const usersDB = await User.find({});
    return usersDB.map(user => user.toJSON());
};

describe('testing blog api', () => {
    let token;

    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'rcmartin', name: 'Robert C. Martin', passwordHash});
        const savedUser = await user.save();
        const {username, id} = savedUser;
        token = jwt.sign({username, id}, process.env.SECRET);
        const blogsWithUser = blogs.map(blog => ({...blog, user: id}));
        await Blog.insertMany(blogsWithUser);
    });

    test('all blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        strictEqual(response.body.length, blogs.length);
    });

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        for (const blog of response.body) {
            ok(blog.id, 'no id property');
            strictEqual(typeof blog.id, 'string');
        }
    });

    test('create a new blog post', async () => {
        const newBlog = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 0,
        };
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const blogsAtEnd = await blogsInDB();
        const titles = blogsAtEnd.map(blog => blog.title);
        ok(titles.includes(newBlog.title));
        strictEqual(blogsAtEnd.length, blogs.length + 1);
    });

    test('likes property default to 0 if missing', async () => {
        const newBlog = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        };
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        strictEqual(response.body.likes, 0);
    });

    test('blog without title or url is not created', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
        };
        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400);
        const blogsAtEnd = await blogsInDB();
        strictEqual(blogsAtEnd.length, blogs.length);
    });

    test('delete a blog post', async () => {
        const blogsAtStart = await blogsInDB();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204);
        const blogsAtEnd = await blogsInDB();
        const titles = blogsAtEnd.map(blog => blog.title);
        ok(!titles.includes(blogToDelete.title));
        strictEqual(blogsAtEnd.length, blogs.length - 1);
    });

    test('update likes for a blog post', async () => {
        const blogsAtStart = await blogsInDB();
        const blogToUpdate = blogsAtStart[1];
        blogToUpdate.likes += 1;
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        strictEqual(response.body.likes, blogToUpdate.likes);
    });

    test('blog not created if token is not provided', async () => {
        const newBlog = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 0,
        };
        await api.post('/api/blogs').send(newBlog).expect(401);
        const blogsAtEnd = await blogsInDB();
        strictEqual(blogsAtEnd.length, blogs.length);
    });

    test('blog not deleted if user is unauthorized', async () => {
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'mchan', name: 'Michael Chan', passwordHash});
        const savedUser = await user.save();
        const newToken = jwt.sign({username: savedUser.username, id: savedUser._id}, process.env.SECRET);
        const blogsAtStart = await blogsInDB();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${newToken}`).expect(403);
        const blogsAtEnd = await blogsInDB();
        ok(blogsAtEnd.find(blog => blog.id === blogToDelete.id));
        strictEqual(blogsAtEnd.length, blogs.length);
    });
});

describe('testing user api', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'root', passwordHash});
        await user.save();
    });

    test('a valid user is created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        const usernames = usersAtEnd.map(user => user.username);
        strictEqual(usersAtEnd.length, usersAtStart.length + 1);
        ok(usernames.includes(newUser.username));
    });

    test('user with username less than 3 characters is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
        ok(response.body.error.includes('username must be at least 3 characters long'));
    });

    test('user with password less than 3 characters is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'ml',
        };
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
        ok(response.body.error.includes('password must be at least 3 characters long'));
    });

    test('user with username not unique is not created', async () => {
        const usersAtStart = await usersInDB();
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await usersInDB();
        strictEqual(usersAtEnd.length, usersAtStart.length);
        ok(response.body.error.includes('username must be unique'));
    });
});

after(async () => {
    await mongoose.connection.close();
});

import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import {before, beforeEach, describe, test, after} from 'node:test';
import {ok, strictEqual} from 'node:assert';

const api = supertest(app);

const user = {
    name: 'Robert C. Martin',
    username: 'rcmartin',
    password: 'sekret',
};

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

describe('testing blogs api', () => {
    let userId;
    let token;

    before(async () => {
        await User.deleteMany({});
        let response = await api.post('/api/users').send(user);
        userId = response.body.id;
        response = await api.post('/api/login').send(user);
        token = response.body.token;
    });

    beforeEach(async () => {
        await Blog.deleteMany({});
        const blogsWithUser = blogs.map(blog => ({...blog, user: userId}));
        await Blog.insertMany(blogsWithUser);
    });

    test('unique identifier property of the blog posts is named id', async () => {
        const blogs = await blogsInDB();
        for (const blog of blogs) {
            ok(blog.id, 'no id property');
            strictEqual(typeof blog.id, 'string');
        }
    });

    test('all blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        strictEqual(response.body.length, blogs.length);
    });

    describe('testing POST', () => {
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
            await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201);
            const blogsAtEnd = await blogsInDB();
            const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title);
            strictEqual(addedBlog.likes, 0);
        });

        test('blog without title is not created', async () => {
            const newBlog = {
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
            };
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/);
            const blogsAtEnd = await blogsInDB();
            strictEqual(blogsAtEnd.length, blogs.length);
        });

        test('blog without url is not created', async () => {
            const newBlog = {
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                likes: 0,
            };
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/);
            const blogsAtEnd = await blogsInDB();
            strictEqual(blogsAtEnd.length, blogs.length);
        });

        test('blog without token is not created', async () => {
            const newBlog = {
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
            };
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/);
            const blogsAtEnd = await blogsInDB();
            const titles = blogsAtEnd.map(blog => blog.title);
            ok(!titles.includes(newBlog.title));
            strictEqual(blogsAtEnd.length, blogs.length);
        });
    });

    test('update a blog post', async () => {
        const blogsAtStart = await blogsInDB();
        const blogToUpdate = blogsAtStart[1];
        const modifiedBlog = {
            title: 'Type wars (updated)',
            author: 'Robert Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars_updated.html',
            likes: blogToUpdate.likes + 1,
        };
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(modifiedBlog).expect(200);
        const updatedBlog = await Blog.findById(blogToUpdate.id);
        strictEqual(updatedBlog.title, modifiedBlog.title);
        strictEqual(updatedBlog.author, modifiedBlog.author);
        strictEqual(updatedBlog.url, modifiedBlog.url);
        strictEqual(updatedBlog.likes, modifiedBlog.likes);
    });

    describe('testing DELETE', () => {
        test('delete a blog post', async () => {
            const blogsAtStart = await blogsInDB();
            const blogToDelete = blogsAtStart[0];
            await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204);
            const blogsAtEnd = await blogsInDB();
            const titles = blogsAtEnd.map(blog => blog.title);
            ok(!titles.includes(blogToDelete.title));
            strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
        });

        test('blog not deleted if user is unauthorized', async () => {
            const blogsAtStart = await blogsInDB();
            const blogToDelete = blogsAtStart[0];
            const anotherUser = {
                name: 'Michael Chan',
                username: 'mchan',
                password: 'sekret',
            };
            await api.post('/api/users').send(anotherUser);
            const response = await api.post('/api/login').send(anotherUser);
            const newToken = response.body.token;
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${newToken}`)
                .expect(403)
                .expect('Content-Type', /application\/json/);
            const blogsAtEnd = await blogsInDB();
            ok(blogsAtEnd.find(blog => blog.id === blogToDelete.id));
            strictEqual(blogsAtEnd.length, blogsAtStart.length);
        });
    });
});

after(async () => {
    await mongoose.connection.close();
});

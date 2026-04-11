import {describe, test} from 'node:test';
import {strictEqual, deepStrictEqual} from 'node:assert';
import {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes} from '../utils/list_helper.js';

const blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        _id: '5a422a851b54a676234d17f7',
        __v: 0,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        _id: '5a422aa71b54a676234d17f8',
        __v: 0,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        _id: '5a422b3a1b54a676234d17f9',
        __v: 0,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        _id: '5a422b891b54a676234d17fa',
        __v: 0,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        _id: '5a422ba71b54a676234d17fb',
        __v: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        _id: '5a422bc61b54a676234d17fc',
        __v: 0,
    },
];

describe('testing list_helper', () => {
    test('dummy returns one', () => {
        const result = dummy([]);
        strictEqual(result, 1);
    });

    describe('total likes', () => {
        test('is zero when list is empty', () => {
            const result = totalLikes([]);
            strictEqual(result, 0);
        });

        test('when list has only one blog equals the likes of that blog', () => {
            const result = totalLikes([blogs[0]]);
            strictEqual(result, 7);
        });

        test('when list has many blogs equals the sum of likes of all blogs', () => {
            const result = totalLikes(blogs);
            strictEqual(result, 36);
        });
    });

    describe('favourite blog', () => {
        test('is empty object when list is empty', () => {
            const result = favouriteBlog([]);
            deepStrictEqual(result, {});
        });

        test('when list has only one blog equals that blog', () => {
            const result = favouriteBlog([blogs[0]]);
            deepStrictEqual(result, blogs[0]);
        });

        test('when list has many blogs equals the blog with most likes', () => {
            const result = favouriteBlog(blogs);
            deepStrictEqual(result, blogs[2]);
        });
    });

    describe('most blogs', () => {
        test('is null when list is empty', () => {
            const result = mostBlogs([]);
            strictEqual(result, null);
        });

        test('when list has one blog equals the author of that blog', () => {
            const result = mostBlogs([blogs[0]]);
            const expected = {
                author: blogs[0].author,
                blogs: 1,
            };
            deepStrictEqual(result, expected);
        });

        test('when list has many blogs equals the author with most blogs', () => {
            const result = mostBlogs(blogs);
            const expected = {
                author: 'Robert C. Martin',
                blogs: 3,
            };
            deepStrictEqual(result, expected);
        });
    });

    describe('most likes', () => {
        test('is null when list is empty', () => {
            const result = mostLikes([]);
            strictEqual(result, null);
        });

        test('when list has one blog equals the author and likes of that blog', () => {
            const result = mostLikes([blogs[0]]);
            const expected = {
                author: blogs[0].author,
                likes: blogs[0].likes,
            };
            deepStrictEqual(result, expected);
        });

        test('when list has many blogs equals the author with most likes', () => {
            const result = mostLikes(blogs);
            const expected = {
                author: 'Edsger W. Dijkstra',
                likes: 17,
            };
            deepStrictEqual(result, expected);
        });
    });
});

import {describe, test} from 'node:test';
import {strictEqual, deepStrictEqual} from 'node:assert';
import {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes} from '../utils/list_helper.js';

const blog = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 5,
        __v: 0,
    },
];

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
    },
];

const blogsTest = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 7,
        __v: 0,
    },
];

test('dummy returns one', () => {
    const result = dummy(blogs);
    strictEqual(result, 1);
});

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes([]);
        strictEqual(result, 0);
    });

    test('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes(blog);
        strictEqual(result, 5);
    });

    test('of a bigger list, is calculated right', () => {
        const result = totalLikes(blogs);
        strictEqual(result, 36);
    });
});

describe('most liked', () => {
    test('when list has only one blog, is that blog', () => {
        const result = favouriteBlog(blog);
        deepStrictEqual(result, blog[0]);
    });

    test('when list has many blogs, is the blog with the highest likes', () => {
        const result = favouriteBlog(blogs);
        deepStrictEqual(result, blogs[2]);
    });

    test('when the list has multiple blogs with the same likes, is the first blog with the highest likes', () => {
        const result = favouriteBlog(blogsTest);
        deepStrictEqual(result, blogsTest[0]);
    });
});

describe('most blogs', () => {
    test('when the list has only one blog, is that author', () => {
        const result = mostBlogs(blog);
        deepStrictEqual(result, {
            author: 'Michael Chan',
            blogs: 1,
        });
    });

    test('when the list has many blogs, is the author with the most blogs', () => {
        const result = mostBlogs(blogs);
        deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3,
        });
    });

    test('when the list has multiple authors with the same number of blogs, is the first author', () => {
        const result = mostBlogs(blogsTest);
        deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            blogs: 2,
        });
    });
});

describe('most likes', () => {
    test('when the list has only one blog, equals the likes of that blog', () => {
        const result = mostLikes(blog);
        deepStrictEqual(result, {
            author: 'Michael Chan',
            likes: 5,
        });
    });

    test('when the list has many blogs, is the author with the most likes', () => {
        const result = mostLikes(blogs);
        deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        });
    });

    test('when the list has multiple authors with the most likes, is the first author', () => {
        const result = mostLikes(blogs);
        deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        });
    });
});

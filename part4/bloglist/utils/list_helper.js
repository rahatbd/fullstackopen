export const dummy = blogs => {
    if (Array.isArray(blogs)) return 1;
};

export const totalLikes = blogs => blogs.reduce((sum, {likes}) => sum + likes, 0);

export const favouriteBlog = blogs => blogs.reduce((likedBlog, blog) => (blog.likes > likedBlog.likes ? blog : likedBlog));

export const mostBlogs = blogs => {
    const blogsCount = blogs.reduce((authorCount, {author}) => {
        authorCount[author] = (authorCount[author] || 0) + 1;
        return authorCount;
    }, {});
    const [author, count] = Object.entries(blogsCount).reduce((maxBlogs, entry) => (entry[1] > maxBlogs[1] ? entry : maxBlogs));
    return {author, blogs: count};
};

export const mostLikes = blogs => {
    const likesCount = blogs.reduce((authorCount, {author, likes}) => {
        authorCount[author] = (authorCount[author] || 0) + likes;
        return authorCount;
    }, {});
    const [author, likes] = Object.entries(likesCount).reduce((maxLikes, entry) => (entry[1] > maxLikes[1] ? entry : maxLikes));
    return {author, likes};
};

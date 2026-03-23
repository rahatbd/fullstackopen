import express from 'express';
import mongoose from 'mongoose';
import loginRouter from './controllers/login.js';
import usersRouter from './controllers/users.js';
import blogsRouter from './controllers/blogs.js';
import {MONGODB_URI} from './utils/config.js';
import {info, error} from './utils/logger.js';
import {tokenExtractor, errorHandler} from './utils/middleware.js';

mongoose
    .connect(MONGODB_URI)
    .then(() => info('connected to MongoDB!'))
    .catch(err => error('error connecting to MongoDB:', err.message));

const app = express();

app.use(express.json());
app.use(tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

app.use(errorHandler);

export default app;

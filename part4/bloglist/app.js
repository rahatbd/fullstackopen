import express from 'express';
import mongoose from 'mongoose';
import loginRouter from './controllers/login.js';
import usersRouter from './controllers/users.js';
import blogsRouter from './controllers/blogs.js';
import {MONGODB_URI} from './utils/config.js';
import {info, error as logError} from './utils/logger.js';
import {requestLogger, tokenExtractor, unknownEndpoint, errorHandler} from './utils/middleware.js';

mongoose
    .connect(MONGODB_URI)
    .then(() => info('connected to MongoDB!'))
    .catch(error => logError('cannot connect to MongoDB:', error.message));

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

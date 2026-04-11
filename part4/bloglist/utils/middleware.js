import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {info, error as logError} from './logger.js';

export const requestLogger = (request, response, next) => {
    info('------');
    info('Method:', request.method);
    info('Path:', request.path);
    info('Body:', request.body);
    info('------');
    next();
};

export const unknownEndpoint = (request, response) => response.status(404).json({error: 'unknown endpoint'});

export const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    request.token = authorization?.startsWith('Bearer ') ? authorization.replace('Bearer ', '') : null;
    next();
};

export const userExtractor = async (request, response, next) => {
    if (!request.token) return response.status(401).json({error: 'token missing'});
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) return response.status(401).json({error: 'token invalid'});
    const user = await User.findById(decodedToken.id);
    if (!user) return response.status(401).json({error: 'user not found'});
    request.user = user;
    next();
};

export const errorHandler = (error, request, response, next) => {
    logError(error.message);
    if (error.name === 'CastError') return response.status(400).json({error: 'malformatted id'});
    if (error.name === 'ValidationError') return response.status(400).json({error: error.message});
    if (error.name === 'MongoServerError' && error.code === 11000) return response.status(400).json({error: 'username must be unique'});
    if (error.name === 'JsonWebTokenError') return response.status(401).json({error: 'token invalid or missing'});
    next(error);
};

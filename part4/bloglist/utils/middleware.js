import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) request.token = authorization.replace('Bearer ', '');
    next();
};

export const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) return response.status(401).json({error: 'token invalid'});
    const user = await User.findById(decodedToken.id);
    if (!user) return response.status(401).json({error: 'user not found'});
    request.user = user;
    next();
};

export const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'MongoServerError' && error.code === 11000) return response.status(400).json({error: 'username must be unique'});
    else if (error.name === 'JsonWebTokenError') return response.status(401).json({error: 'token invalid or missing'});
    next(error);
};

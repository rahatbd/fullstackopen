import 'dotenv/config';

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
const {PORT} = process.env;

export {MONGODB_URI, PORT};

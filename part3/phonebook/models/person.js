import mongoose from 'mongoose';

const {MONGODB_URI: mongodbUrl} = process.env;

mongoose
    .connect(mongodbUrl)
    .then(() => console.log('connected to MongoDB!'))
    .catch(error => console.log('error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters long'],
        validate: {
            validator: value => value.trim().length > 0,
            message: 'Name cannot be empty',
        },
    },
    number: {
        type: String,
        required: [true, 'Number is required'],
        validate: {
            validator: value => /^\d{3}\.\d{3}\.\d{4}$/.test(value),
            message: 'Number must be in the format 123.456.7890',
        },
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model('Person', personSchema);

export default Person;

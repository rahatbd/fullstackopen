import 'dotenv/config';
import mongoose from 'mongoose';

// if (process.argv.length < 3) {
//     console.log('password not provided as an argument');
//     process.exit(1);
// }

// const [, , name, number] = process.argv;
const {MONGODB_URI: mongodbUrl} = process.env;

mongoose.connect(mongodbUrl);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// const person = new Person({name, number});

// person.save().then(({name, number}) => {
//     console.log(`added ${name} number ${number} to phonebook`);
//     mongoose.connection.close();
// });

Person.find({}).then(persons => {
    console.log('phonebook:');
    for (const {name, number} of persons) {
        console.log(name, number);
    }
    mongoose.connection.close();
});

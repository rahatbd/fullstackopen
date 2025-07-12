import 'dotenv/config';
import mongoose from 'mongoose';

if (process.argv.length !== 2 && process.argv.length !== 4) {
    console.log('wrong number of arguments provided');
    process.exit(1);
}

const {MONGODB_URI: mongodbUrl} = process.env;

mongoose.connect(mongodbUrl);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 2) {
    Person.find({}).then(persons => {
        console.log('phonebook:');
        for (const {name, number} of persons) {
            console.log(name, number);
        }
        mongoose.connection.close();
    });
}

if (process.argv.length === 4) {
    const [, , name, number] = process.argv;
    const person = new Person({name, number});
    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}

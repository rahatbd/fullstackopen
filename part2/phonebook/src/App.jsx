import {useEffect, useState} from 'react';
import {getPersons, createPerson, updatePerson, deletePerson} from './persons';

const Notification = ({message, type}) => (
    <p
        className={`notification ${type}`}
        role={type === 'error' ? 'alert' : 'status'}
    >
        {message}
    </p>
);

const Filter = ({persons, newSearch, handleSearch}) => (
    <div>
        <label>
            filter shown with
            <input
                value={newSearch}
                placeholder="search name..."
                onChange={handleSearch}
                list="numbers"
            />
        </label>
        <datalist id="numbers">
            {persons.map(({name, id}) => (
                <option
                    key={id}
                    value={name}
                />
            ))}
        </datalist>
    </div>
);

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, handleSubmit}) => (
    <form onSubmit={handleSubmit}>
        <div>
            <label>
                name:
                <input
                    value={newName}
                    placeholder="Ada"
                    onChange={event => setNewName(event.target.value)}
                    required
                />
            </label>
        </div>
        <div>
            <label>
                number:
                <input
                    value={newNumber}
                    placeholder="416.555.7890"
                    onChange={event => setNewNumber(event.target.value)}
                    required
                />
            </label>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
);

const Persons = ({newSearch, searchPersons, persons, handleDelete}) => {
    const personList = newSearch.trim() ? searchPersons : persons;
    const noSearchPerson = newSearch.trim() && personList.length === 0;
    const noAddedPerson = persons.length === 0;

    return (
        <>
            {noSearchPerson ? (
                <p>
                    <em>no numbers found</em>
                </p>
            ) : noAddedPerson ? (
                <p>
                    <em>no numbers added</em>
                </p>
            ) : (
                <ul>
                    {personList.map(({name, number, id}) => (
                        <li key={id}>
                            {name} | {number} &nbsp;
                            <button onClick={() => handleDelete(id)}>delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [searchPersons, setSearchPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newSearch, setNewSearch] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPersons()
            .then(data => setPersons(data))
            .catch(error => {
                console.error(error);
                showMessage({message: `⛔️ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`, type: 'error'});
            })
            .finally(() => setLoading(false));
    }, []);

    const showMessage = message => {
        setMessage(message);
        setTimeout(() => setMessage(null), 2000);
    };

    const handleSearch = event => {
        const search = event.target.value;
        const filteredPersons = search ? persons.filter(({name}) => name.toLowerCase().includes(search.toLowerCase())) : [];
        setNewSearch(search);
        setSearchPersons(filteredPersons);
    };

    const handleSubmit = event => {
        event.preventDefault();
        const trimmedName = newName.trim();
        const trimmedNumber = newNumber.trim();
        if (!trimmedName || !trimmedNumber) return alert('Name or number cannot be empty');
        const duplicatePerson = persons.find(({name}) => name.toLowerCase() === trimmedName.toLowerCase());
        if (duplicatePerson) {
            if (window.confirm(`${trimmedName} is already added to phonebook, replace the old number with a new one?`)) {
                updatePerson(duplicatePerson.id, {...duplicatePerson, number: trimmedNumber})
                    .then(data => {
                        setPersons(persons.map(person => (person.id === data.id ? data : person)));
                        showMessage({message: `Updated ${trimmedName}`, type: 'update'});
                    })
                    .catch(error => {
                        console.error(error);
                        showMessage({message: `⛔️ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`, type: 'error'});
                    });
            } else {
                return;
            }
        } else {
            const newPerson = {name: trimmedName, number: trimmedNumber};
            createPerson(newPerson)
                .then(data => {
                    setPersons([...persons, data]);
                    showMessage({message: `Added ${trimmedName}`, type: 'new'});
                })
                .catch(error => {
                    console.error(error);
                    showMessage({message: `⛔️ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`, type: 'error'});
                });
        }
        setNewName('');
        setNewNumber('');
        document.activeElement.blur();
    };

    const handleDelete = personId => {
        const {name} = persons.find(({id}) => id === personId);
        if (window.confirm(`Delete ${name}?`)) {
            deletePerson(personId)
                .then(() => {
                    setPersons(persons.filter(({id}) => id !== personId));
                    showMessage({message: `Deleted ${name}`, type: 'delete'});
                })
                .catch(error => {
                    console.error(error);
                    showMessage({message: `⛔️ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`, type: 'error'});
                });
        }
    };

    return (
        <>
            <h1>Phonebook</h1>
            {message && <Notification {...message} />}
            <Filter
                persons={persons}
                newSearch={newSearch}
                handleSearch={handleSearch}
            />
            <h2>add a new</h2>
            <PersonForm
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}
                handleSubmit={handleSubmit}
            />
            <h2>Numbers</h2>
            {loading ? (
                <p>
                    <em>loading...</em>
                </p>
            ) : (
                <Persons
                    searchPersons={searchPersons}
                    persons={persons}
                    newSearch={newSearch}
                    handleDelete={handleDelete}
                />
            )}
        </>
    );
};

export default App;

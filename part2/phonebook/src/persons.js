import axios from 'axios';
const baseURL = 'http://localhost:3001/persons';

export const getPersons = async () => (await axios.get(baseURL)).data;
export const createPerson = async newPerson => (await axios.post(baseURL, newPerson)).data;
export const updatePerson = async (personId, person) => (await axios.put(`${baseURL}/${personId}`, person)).data;
export const deletePerson = async personId => (await axios.delete(`${baseURL}/${personId}`)).data;

import axios from 'axios';
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api';

export const getCountries = async () => (await axios.get(`${baseURL}/all`)).data;
export const getCountry = async name => (await axios.get(`${baseURL}/name/${name}`)).data;

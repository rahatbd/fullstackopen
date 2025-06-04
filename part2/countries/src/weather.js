import axios from 'axios';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (capital, altSpellings) =>
    (await axios.get(`${baseURL}?q=${capital},${altSpellings}&units=metric&appid=${import.meta.env.VITE_API_KEY}`)).data;

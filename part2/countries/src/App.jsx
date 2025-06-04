import {useState, useEffect} from 'react';
import {getCountries, getCountry} from './countries';
import {getWeather} from './weather';

function App() {
    const [countries, setCountries] = useState([]);
    const [searchCountries, setSearchCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [weather, setWeather] = useState(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCountries()
            .then(data => setCountries(data.map(({name, capital, altSpellings}) => ({name: name.common, capital, altSpellings: altSpellings[0]}))))
            .catch(error => {
                console.error(error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (searchCountries.length !== 1) return;
        setLoading(true);
        setError(null);
        const {name, capital, altSpellings} = searchCountries[0];
        Promise.all([getCountry(name), getWeather(capital, altSpellings)])
            .then(([countryData, weatherData]) => {
                setCountry(countryData);
                setWeather(weatherData);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, [searchCountries]);

    const handleSearch = event => {
        const search = event.target.value;
        const matchCountries = search ? countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase())) : [];
        setQuery(search);
        if (matchCountries.length === 1 && country?.name.common === matchCountries[0].name) return;
        setSearchCountries(matchCountries);
        setCountry(null);
    };

    const flex = {
        display: 'flex',
        alignItems: 'center',
        gap: '.5ch',
    };

    return (
        <>
            <h1>Countries</h1>
            <label htmlFor="country">find countries: </label>
            <input
                id="country"
                value={query}
                placeholder="Canada"
                onChange={handleSearch}
                disabled={!countries.length || error}
            />
            <hr />
            {error && (
                <div style={flex}>
                    <p style={{color: 'red'}}>
                        <strong>{error}</strong>
                    </p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}
            {loading ? (
                <p>
                    <em>loading...</em>
                </p>
            ) : (
                query &&
                !country &&
                !searchCountries.length && (
                    <p>
                        <em>no countries found</em>
                    </p>
                )
            )}
            {searchCountries.length > 10 ? (
                <p>too many matches, specify another filter</p>
            ) : country ? (
                <>
                    <h2>{country.name.common}</h2>
                    <p>Capital: {country.capital}</p>
                    <p style={{marginTop: -16}}>Area: {country.area}</p>
                    <h3>Language(s)</h3>
                    <ul>
                        {Object.values(country.languages).map(lang => (
                            <li key={lang}>{lang}</li>
                        ))}
                    </ul>
                    <img
                        src={country.flags.png}
                        alt={country.flags.alt || `${country.name.common} flag`}
                        title={country.flags.alt}
                    />
                    {weather && (
                        <>
                            <h2>Weather in {weather.name}</h2>
                            <p>Temperature: {weather.main.temp}&deg;C</p>
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                title={weather.weather[0].main}
                            />
                            <p>Wind: {weather.wind.speed}m/s</p>
                        </>
                    )}
                </>
            ) : (
                searchCountries.length !== 1 &&
                searchCountries.map(country => (
                    <div
                        key={country.name}
                        style={flex}
                    >
                        <p style={{marginBlock: 4}}>{country.name}</p>
                        <button onClick={() => setSearchCountries([country])}>Show</button>
                    </div>
                ))
            )}
        </>
    );
}

export default App;

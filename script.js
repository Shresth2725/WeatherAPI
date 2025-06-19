// let result = document.getElementById("result");
// let searchBtn = document.getElementById("search-btn");
// let cityRef = document.getElementById("city");

// let getWeather = async () => {
//     const API_KEY = '8f13a29c3eb448549a8175430252801';
//     const proxyUrl = "https://cors-anywhere.herokuapp.com/"; 
//     let city = cityRef.value.trim(); 

//     if (!city) {
//         result.innerHTML = `<p>Please enter a city name.</p>`;
//         return;
//     }

//     const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
//     const url = `${proxyUrl}${apiUrl}`; 
//     console.log("Request URL:", url); 
    
//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log(data); 
//         result.innerHTML = `
//             <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
//             <p>Temperature: ${data.current.temp_c}°C</p>
//             <p>Feels Like: ${data.current.feelslike_c}°C</p>
//             <p>Condition: ${data.current.condition.text}</p>
//             <p>Humidity: ${data.current.humidity}%</p>
//             <p>Wind: ${data.current.wind_kph} kph (${data.current.wind_dir})</p>
//             <p>Pressure: ${data.current.pressure_mb} mb</p>
//             <p>UV Index: ${data.current.uv}</p>
//             <img src="${data.current.condition.icon}" alt="Weather Icon">
//         `;
//     } catch (error) {
//         console.error('Failed to fetch weather data:', error.message);
//         result.innerHTML = `<p>Failed to fetch weather data: ${error.message}</p>`;
//     }
// };

// searchBtn.addEventListener("click", getWeather);




let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");

const API_KEY = '8f13a29c3eb448549a8175430252801';
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

// Function to get cached weather data
function getCachedWeather(city) {
    const cachedData = localStorage.getItem(`weather_${city}`);
    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
            console.log("Using cached data.");
            return data;
        }
    }
    return null;
}

// Function to fetch weather data
let getWeather = async () => {
    let city = cityRef.value.trim(); 
    if (!city) {
        result.innerHTML = `<p>Please enter a city name.</p>`;
        return;
    }

    // Check cached data before making API call
    const cachedData = getCachedWeather(city);
    if (cachedData) {
        displayWeather(cachedData);
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    console.log("Requesting:", apiUrl);

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 429) {
                result.innerHTML = `<p>Rate limit exceeded. Please wait a moment and try again.</p>`;
                return;
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        localStorage.setItem(`weather_${city}`, JSON.stringify({ data, timestamp: Date.now() }));
        displayWeather(data);
    } catch (error) {
        console.error('Failed to fetch weather data:', error.message);
        result.innerHTML = `<p>Failed to fetch weather data: ${error.message}</p>`;
    }
};

// Function to display weather data
function displayWeather(data) {
    result.innerHTML = `
        <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
        <p>Temperature: ${data.current.temp_c}°C</p>
        <p>Feels Like: ${data.current.feelslike_c}°C</p>
        <p>Condition: ${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind: ${data.current.wind_kph} kph (${data.current.wind_dir})</p>
        <p>Pressure: ${data.current.pressure_mb} mb</p>
        <p>UV Index: ${data.current.uv}</p>
        <img src="${data.current.condition.icon}" alt="Weather Icon">
    `;
}

// Event listener for search button
searchBtn.addEventListener("click", getWeather);

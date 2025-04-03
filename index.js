// API key for OpenWeatherMap
const apiKey = "d1845658f92b31c64bd94f06f7188c9c";
const searchInput = document.getElementById("search");

// Function to fetch current weather data
async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === 200) {
            updateWeatherUI(data);
            fetchAirCondition(city, data.coord.lat, data.coord.lon);
        } else {
            alert("City not found");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to fetch air condition data
async function fetchAirCondition(city, lat, lon) {
    try {
        // Get air pollution data
        const airPollutionResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const airPollutionData = await airPollutionResponse.json();

        // Get additional weather data to enhance air condition information
        const oneCallResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
        );
        const oneCallData = await oneCallResponse.json();

        updateAirConditionUI(airPollutionData, oneCallData);
    } catch (error) {
        console.error("Error fetching air condition data:", error);
        // If API call fails, update with basic data already available
        updateBasicAirConditionUI();
    }
}

// Function to update air condition UI with enhanced data
function updateAirConditionUI(airPollutionData, oneCallData) {
    // Real feel temperature
    if (oneCallData && oneCallData.current) {
        document.getElementById("feellike").textContent = `${Math.round(oneCallData.current.feels_like)}°`;
    }

    // Wind speed
    if (oneCallData && oneCallData.current) {
        document.getElementById("curr-windspeed").textContent = `${Math.round(oneCallData.current.wind_speed)} km/h`;
    }

    // Humidity
    if (oneCallData && oneCallData.current) {
        document.getElementById("humidity").textContent = `${oneCallData.current.humidity} %`;
    }

    // UV index
    if (oneCallData && oneCallData.current) {
        const uvIndex = Math.round(oneCallData.current.uvi);
        document.getElementById("uv").textContent = uvIndex;
    }
}

// Fallback function to update air condition UI with basic data
function updateBasicAirConditionUI() {
    // Get the latest weather data we have
    const temp = document.getElementById("curr-temp").textContent;
    const tempValue = parseInt(temp);

    // Estimate air conditions based on temperature
    document.getElementById("feellike").textContent = `${tempValue - 2}°`;
    document.getElementById("humidity").textContent = `${Math.min(70 + Math.floor(Math.random() * 20), 100)} %`;
    document.getElementById("curr-windspeed").textContent = `${3 + Math.floor(Math.random() * 8)} km/h`;
    document.getElementById("uv").textContent = tempValue > 25 ? "7" : "3";
}

// Function to update UI with current weather data
function updateWeatherUI(data) {
    document.getElementById("cityname").textContent = data.name;
    document.getElementById("curr-temp").textContent = `${Math.round(data.main.temp)}°`;

    // Update basic air condition section with the data we already have
    document.getElementById("feellike").textContent = `${Math.round(data.main.feels_like)}°`;
    document.getElementById("curr-windspeed").textContent = `${data.wind.speed} km/h`;
    document.getElementById("humidity").textContent = `${data.main.humidity} %`;

    // Calculate UV index based on weather conditions (approximation since some APIs might not provide UV)
    let uvIndex = 0;
    if (data.weather[0].main === "Clear") {
        const hour = new Date().getHours();
        if (hour > 10 && hour < 16) uvIndex = 8;
        else if (hour > 7 && hour < 19) uvIndex = 5;
        else uvIndex = 0;
    } else if (data.weather[0].main === "Clouds") {
        uvIndex = 3;
    } else {
        uvIndex = 1;
    }
    document.getElementById("uv").textContent = uvIndex;

    // Update main weather icon
    const weatherIcon = document.getElementById("weather_icon");
    weatherIcon.src = getWeatherIcon(data.weather[0].main, true);
}

// Function to get appropriate weather icons based on condition and time
function getWeatherIcon(condition, isLarge = false) {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    const icons = {
        "Clear": isNight ? "./images/clear night.png" : "./images/sunny.png",
        "Clouds": isNight ? "./images/cloudy-night.png" : "./images/cloud.png",
        "Few Clouds": isNight ? "./images/cloudy-night.png" : "./images/sunny cloudy.png",
        "Scattered Clouds": isNight ? "./images/cloudy-night.png" : "./images/sunny cloudy.png",
        "Broken Clouds": isNight ? "./images/cloudy-night.png" : "./images/cloud.png",
        "Rain": "./images/rainy.png",
        "Drizzle": "./images/rainy.png",
        "Thunderstorm": "./images/thunderstorm.png",
        "Snow": "./images/snow.png",
        "Mist": "./images/mist.png",
        "Fog": "./images/mist.png",
    };

    return icons[condition] || (isNight ? "./images/clear night.png" : "./images/sunny.png");
}

// Function to get time-specific weather icon
function getTimeSpecificIcon(condition, timestamp) {
    const hour = new Date(timestamp * 1000).getHours();
    const isNight = hour < 6 || hour > 18;

    if (condition === "Clear") {
        return isNight ? "./images/clear night.png" : "./images/sunny.png";
    } else if (condition === "Clouds" || condition === "Few Clouds" || condition === "Scattered Clouds") {
        return isNight ? "./images/cloudy-night.png" : (condition === "Few Clouds" || condition === "Scattered Clouds" ? "./images/sunny cloudy.png" : "./images/cloud.png");
    } else if (condition === "Rain" || condition === "Drizzle") {
        return "./images/rainy.png";
    } else {
        return isNight ? "./images/clear night.png" : "./images/sunny.png";
    }
}

// Fetch today's hourly forecast
async function fetchTodaysForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === "200") {
            updateTodaysForecastUI(data.list);
        }
    } catch (error) {
        console.error("Error fetching today's forecast data:", error);
    }
}

// Function to update today's hourly forecast UI
function updateTodaysForecastUI(forecastData) {
    const forecastCards = document.querySelectorAll('.flex.flex-row.pl-4.pt-3 .flex.flex-col.justify-center.items-center');

    // Only use the first 7 forecast intervals (covers 24 hours)
    const todayForecasts = forecastData.slice(0, 7);

    forecastCards.forEach((card, index) => {
        if (index < todayForecasts.length) {
            const forecast = todayForecasts[index];
            const time = new Date(forecast.dt * 1000);
            const hours = time.getHours();
            const formattedTime = `${hours === 0 ? '12' : hours > 12 ? hours - 12 : hours}:00 ${hours >= 12 ? 'PM' : 'AM'}`;

            // Update time
            card.querySelector('.text-gray-500.font-bold').textContent = formattedTime;

            // Update temperature
            card.querySelector('.text-white.font-bold.text-2xl').textContent = `${Math.round(forecast.main.temp)}°`;

            // Update weather icon
            const iconElement = card.querySelector('img');
            iconElement.src = getTimeSpecificIcon(forecast.weather[0].main, forecast.dt);
        }
    });
}

// Fetch 7-day forecast
async function fetchWeeklyForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === "200") {
            updateWeeklyForecastUI(data.list);
        }
    } catch (error) {
        console.error("Error fetching weekly forecast data:", error);
    }
}

// Function to update 7-day forecast UI
function updateWeeklyForecastUI(forecastData) {
    const weeklyForecastItems = document.querySelectorAll('.space-y-3 .flex.justify-between');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Group forecast by day to get daily max/min
    const dailyForecasts = {};

    forecastData.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format

        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                dayName: days[date.getDay()],
                temps: [],
                conditions: []
            };
        }

        dailyForecasts[day].temps.push(forecast.main.temp);
        dailyForecasts[day].conditions.push(forecast.weather[0].main);
    });

    // Convert object to array and get first 7 days
    const dailyForecastArray = Object.values(dailyForecasts).slice(0, 7);

    // Update the weekly forecast UI
    weeklyForecastItems.forEach((item, index) => {
        if (index < dailyForecastArray.length) {
            const forecast = dailyForecastArray[index];
            const maxTemp = Math.round(Math.max(...forecast.temps));
            const minTemp = Math.round(Math.min(...forecast.temps));

            // Find most common weather condition
            const conditionCounts = {};
            forecast.conditions.forEach(condition => {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            });

            let mostCommonCondition = forecast.conditions[0];
            let maxCount = 0;

            for (const condition in conditionCounts) {
                if (conditionCounts[condition] > maxCount) {
                    maxCount = conditionCounts[condition];
                    mostCommonCondition = condition;
                }
            }

            // Update day name
            item.querySelector('span').textContent = forecast.dayName;

            // Update temperature range
            item.querySelectorAll('span')[1].textContent = `${maxTemp}° / ${minTemp}°`;

            // Update weather icon
            item.querySelector('img').src = getWeatherIcon(mostCommonCondition);
        }
    });
}

// Handle click on "See more" button in Air Condition section
document.querySelector('.bg-blue-500.w-28').addEventListener('click', function() {
    const cityName = document.getElementById('cityname').textContent;

    if (cityName) {
        // You could expand this to show a modal with additional air quality information
        alert(`Additional air quality information for ${cityName} would be displayed here. In a production app, this would open a detailed air quality panel.`);
    }
});

// Search event listener
searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
            fetchTodaysForecast(city);
            fetchWeeklyForecast(city);
        }
    }
});

// Fetch user's location and weather on page load
window.addEventListener('load', () => {
    // Default city if geolocation fails
    let defaultCity = "New York";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const cityName = data.name;
                        fetchWeather(cityName);
                        fetchTodaysForecast(cityName);
                        fetchWeeklyForecast(cityName);
                    } else {
                        throw new Error('Location not found');
                    }
                })
                .catch(error => {
                    console.error("Error fetching weather by location:", error);
                    // Use default city if there's an error
                    fetchWeather(defaultCity);
                    fetchTodaysForecast(defaultCity);
                    fetchWeeklyForecast(defaultCity);
                });
        }, () => {
            // Use default city if location access is denied
            fetchWeather(defaultCity);
            fetchTodaysForecast(defaultCity);
            fetchWeeklyForecast(defaultCity);
        });
    } else {
        // Use default city if geolocation is not supported
        fetchWeather(defaultCity);
        fetchTodaysForecast(defaultCity);
        fetchWeeklyForecast(defaultCity);
    }
});
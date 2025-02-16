// // console.log('Hello, world!');
// // async function showWeather(){
// //     const cityInput = document.querySelector('#city');
// //     const city = cityInput.value;
// //     const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// //     const response = await fetch(
// //         `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
// //     );

// //     const data = await response.json();
// //     console.log(data);
// //     if (data.cod === '404') {
// //         alert('City not found');
// //         return;
// //     }
// //     let newPara = document.createElement("p");
// //     newPara.textContent = `The weather in ${data.name} is ${data.weather[0].description} and the temperature is ${data.main.temp}°C humdity ${data.main.humidity}% wind speed ${data.wind.speed}m/s`;
// //     document.body.appendChild(newPara);
// // }

// // const button = document.querySelector('.data-butn');
// // button.addEventListener('click', showWeather); 
// // //current location
// // navigator.geolocation.getCurrentPosition(async (position) => {
// //     console.log(position.coords.latitude);
// //     console.log(position.coords.longitude);
// //     const lat = position.coords.latitude;
// //     const lon = position.coords.longitude;
// //     const API = "d1845658f92b31c64bd94f06f7188c9c"; 

// //     async function showmywhether() {      
// //         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
// //         const data = await response.json();
// //         console.log(data);
// //         let newPara = document.createElement("p");
// //         newPara.textContent = `The weather in ${data.name} is ${data.weather[0].description} and the temperature is ${data.main.temp}°C humdity ${data.main.humidity}% wind speed ${data.wind.speed}m/s`;
// //         document.body.appendChild(newPara);
// //     }

// //     await showmywhether();
// // });   

// // //24 hrs weather
// const apiKey = "d1845658f92b31c64bd94f06f7188c9c"; // Replace with your API key
// const searchInput = document.getElementById("search");

// // Function to fetch weather data
// async function fetchWeather(city) {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
//         const data = await response.json();
//         if (data.cod === 200) {
//             updateWeatherUI(data);
//         } else {
//             alert("City not found");
//         }
//     } catch (error) {
//         console.error("Error fetching weather data:", error);
//     }
// }

// // Function to update UI with fetched data
// function updateWeatherUI(data) {
//     document.getElementById("cityname").textContent = data.name;
//     document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°`;
//     document.getElementById("feellike").querySelector(".text-2xl").textContent = `${Math.round(data.main.feels_like)}°`;
//     document.getElementById("wind").querySelector(".text-2xl").textContent = `${data.wind.speed} km/h`;
//     document.getElementById("humidity").querySelector(".text-2xl").textContent = `${data.main.humidity} %`;
//     document.getElementById("uv").querySelector(".text-2xl").textContent = `N/A`;
    
//     const weatherIcon = document.getElementById("weather_icon");
//     weatherIcon.src = getWeatherIcon(data.weather[0].main);
// }

// // Function to get weather icons
// function getWeatherIcon(condition) {
//     const icons = {
//         "Clear": "./images/sunny.png",
//         "Clouds": "./images/cloud.png",
//         "Rain": "./images/rainy.png",
//         "Drizzle": "./images/rainy.png",
//         "Thunderstorm": "./images/thunderstorm.png",
//         "Snow": "./images/snow.png",
//         "Mist": "./images/mist.png",
//         "Fog": "./images/mist.png",
//     };
//     return icons[condition] || "./images/sunny.png";
// }

// // Fetch today's forecast
// async function fetchTodaysForecast(city) {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
//         const data = await response.json();
//         updateTodaysForecastUI(data.list);
//     } catch (error) {
//         console.error("Error fetching today's forecast data:", error);
//     }
// }

// // Function to update today's forecast UI
// function updateTodaysForecastUI(forecast) {
//     const forecastCards = document.querySelectorAll("#forcasttemp");
//     const forecastIcons = document.querySelectorAll("#weather_icon");
    
//     for (let i = 0; i < forecastCards.length; i++) {
//         forecastCards[i].textContent = `${Math.round(forecast[i * 3].main.temp)}°`;
//         forecastIcons[i].src = getWeatherIcon(forecast[i * 3].weather[0].main);
//     }
// }

// // Fetch 7-day forecast
// async function fetchForecast(city) {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
//         const data = await response.json();
//         updateForecastUI(data.list);
//     } catch (error) {
//         console.error("Error fetching forecast data:", error);
//     }
// }

// // Function to update forecast UI
// function updateForecastUI(forecast) {
//     const forecastDivs = document.querySelectorAll(".space-y-3 > div");
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//     forecastDivs.forEach((div, index) => {
//         if (index < 7) {
//             const date = new Date(forecast[index * 8].dt * 1000);
//             const day = days[date.getDay()];
//             const tempMax = Math.round(forecast[index * 8].main.temp_max);
//             const tempMin = Math.round(forecast[index * 8].main.temp_min);
//             const icon = getWeatherIcon(forecast[index * 8].weather[0].main);

//             div.querySelector("span").textContent = day;
//             div.querySelector("img").src = icon;
//             div.querySelectorAll("span")[1].textContent = `${tempMax}° / ${tempMin}°`;
//         }
//     });
// }

// // Search event listener
// searchInput.addEventListener("keyup", (event) => {
//     if (event.key === "Enter") {
//         const city = searchInput.value.trim();
//         if (city) {
//             fetchWeather(city);
//             fetchTodaysForecast(city);
//             fetchForecast(city);
//         }
//     }
// });

// // Fetch user's location and weather on page load
// window.onload = () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(position => {
//             const { latitude, longitude } = position.coords;
//             fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     fetchWeather(data.name);
//                     fetchTodaysForecast(data.name);
//                     fetchForecast(data.name);
//                 })
//                 .catch(error => console.error("Error fetching weather by location:", error));
//         }, () => {
//             // Default city if location access is denied
//             fetchWeather("New York");
//             fetchTodaysForecast("New York");
//             fetchForecast("New York");
//         });
//     } else {
//         fetchWeather("New York");
//         fetchTodaysForecast("New York");
//         fetchForecast("New York");
//     }
// };

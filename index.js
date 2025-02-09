console.log('Hello, world!');
async function showWeather(){
    const cityInput = document.querySelector('#city');
    const city = cityInput.value;
    const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    console.log(data);
    if (data.cod === '404') {
        alert('City not found');
        return;
    }
    let newPara = document.createElement("p");
    newPara.textContent = `The weather in ${data.name} is ${data.weather[0].description} and the temperature is ${data.main.temp}°C humdity ${data.main.humidity}% wind speed ${data.wind.speed}m/s`;
    document.body.appendChild(newPara);
}

const button = document.querySelector('.data-butn');
button.addEventListener('click', showWeather); 
//current location
navigator.geolocation.getCurrentPosition(async (position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const API = "d1845658f92b31c64bd94f06f7188c9c"; 

    async function showmywhether() {      
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        const data = await response.json();
        console.log(data);
        let newPara = document.createElement("p");
        newPara.textContent = `The weather in ${data.name} is ${data.weather[0].description} and the temperature is ${data.main.temp}°C humdity ${data.main.humidity}% wind speed ${data.wind.speed}m/s`;
        document.body.appendChild(newPara);
    }

    await showmywhether();
});   

//24 hrs weather
 
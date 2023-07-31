

class DOM {
 test = document.querySelector('.test')
 country = document.querySelector('.countryname')
 cityname = document.querySelector('.cityname')
 temperature = document.querySelector('.temperature')
 humidity = document.querySelector('.humidity')
 city = "Los Angeles"
 input = document.querySelector("#city")
 submitbtn = document.querySelector('button')
}

let dom = new DOM();

async function apiCall(url) {
    try {
        const response = await fetch(url , {mode:'cors'});
        const data = await response.json();
        let main_data = extractData(data)
        domchange(main_data)
    } catch(error) {
        console.log(`There is an error ${error}`);
    }
}

function domchange(obj) {
    dom.country.textContent = obj.country_name
    dom.cityname.textContent = obj.city_name
    dom.temperature.textContent = `${obj.city_temp_c}°C`
    dom.humidity.textContent = `${obj.city_humidity}%`
}

function formdata() {
    dom.submitbtn.addEventListener('click' , function(e) {
        e.preventDefault()
        dom.city = dom.input.value 
        apiCall(`http://api.weatherapi.com/v1/current.json?key=1b99b3dfb10948888fe125556233007&q=${dom.city}`);
        forecastAPICall(`http://api.weatherapi.com/v1/forecast.json?key=1b99b3dfb10948888fe125556233007&q=${dom.city}&days=7`);        
        dom.input.value = '';
    })
}

function extractData(jsonData) {
    var weather = {
        city_name: jsonData.location.name , 
        country_name: jsonData.location.country,
        city_temp_c: jsonData.current.temp_c,
        city_temp_f: jsonData.current.temp_f,
        city_humidity: jsonData.current.humidity,
    }

    return weather
}

async function forecastAPICall(url) {
    try {
        const response = await fetch(url , {mode:'cors'})
        const data = await response.json();
        console.log(data)
        console.log(extractForecastData(data))

    } catch(error) {
        console.log(error)
    }
}


function extractForecastData(jsonData) {
    forecast = {}
    for(let i = 0 ; i < 7 ; i++) {
        
        forecast[i] = {date: jsonData.forecast.forecastday[i].date 
            , max_temp_c: jsonData.forecast.forecastday[i].day.maxtemp_c,
            min_temp_c: jsonData.forecast.forecastday[i].day.mintemp_c,
        hour: [],avghumidity: jsonData.forecast.forecastday[i].day.avghumidity 
        , chance_of_rain: jsonData.forecast.forecastday[i].day.daily_chance_of_rain , chance_of_snow: jsonData.forecast.forecastday[i].day.daily_chance_of_snow,}

        for (let j = 0 ; j < 24 ; j++) {
            forecast[i].hour[j] = {time: jsonData.forecast.forecastday[i].hour[j].time,
            hour_temp_c: jsonData.forecast.forecastday[i].hour[j].temp_c , 
            hour_humidity: jsonData.forecast.forecastday[i].hour[j].humidity}
        }
    }

    return forecast
}
formdata()
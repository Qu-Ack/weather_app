

class DOM {
 city = "Los Angeles"
 input = document.querySelector("#city")
 submitbtn = document.querySelector('button')
 city_name = document.querySelector('.city-name');
 temperature = document.querySelector('.temp');
 condition = document.querySelector('.condition');
 humidity = document.querySelector('.humidity');
 times = document.querySelectorAll('.time');
 icons = document.querySelectorAll('.condition-icon')
 timetemps = document.querySelectorAll('.time-temp');
 mainimage = document.querySelector('.main-image')
}

let dom = new DOM();
console.log(dom.mainimage)
async function apiCall(url) {
    try {
        const response = await fetch(url , {mode:'cors'});
        const data = await response.json();
        console.log(data)
        let main_data = extractData(data)
        console.log(main_data);
        domchange(main_data)
    } catch(error) {
        console.log(`There is an error ${error}`);
    }
}

function domchange(obj) {
    dom.city_name.textContent = obj.city_name;
    dom.condition.textContent = obj.condition;
    dom.temperature.textContent = `${obj.city_temp_c}°C`;
    dom.humidity.textContent = `${obj.city_humidity}% humidity`;
    dom.mainimage.src = obj.icon;
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
        condition:jsonData.current.condition.text,
        icon:jsonData.current.condition.icon,
        uv:jsonData.current.uv,
    }

    return weather
}

async function forecastAPICall(url) {
    try {
        const response = await fetch(url , {mode:'cors'})
        const data = await response.json();
        let forecastdata = extractForecastData(data)
        console.log(forecastdata)
        domchangeforecast(forecastdata)

    } catch(error) {
        console.log(error)
    }
}


function domchangeforecast(obj) {
    for(let i = 0 ; i < dom.times.length; i++) {
        dom.times[i].textContent = obj["0"].hour[i].time;
        dom.icons[i].src = obj["0"].hour[i].icon
        dom.timetemps[i].textContent = `${obj["0"].hour[i].hour_temp_c}°C`
    }
}

function extractForecastData(jsonData) {
    forecast = {}
    for(let i = 0 ; i < 7 ; i++) {
        
        forecast[i] = {date: jsonData.forecast.forecastday[i].date 
            , max_temp_c: jsonData.forecast.forecastday[i].day.maxtemp_c,
            min_temp_c: jsonData.forecast.forecastday[i].day.mintemp_c,
        hour: [],avghumidity: jsonData.forecast.forecastday[i].day.avghumidity 
        , chance_of_rain: jsonData.forecast.forecastday[i].day.daily_chance_of_rain , chance_of_snow: jsonData.forecast.forecastday[i].day.daily_chance_of_snow,
        condition: jsonData.forecast.forecastday[i].day.condition.text , icon:jsonData.forecast.forecastday[i].day.condition.icon,}

        for (let j = 0 ; j < 24 ; j++) {
            forecast[i].hour[j] = {time: jsonData.forecast.forecastday[i].hour[j].time,
            hour_temp_c: jsonData.forecast.forecastday[i].hour[j].temp_c , 
            hour_humidity: jsonData.forecast.forecastday[i].hour[j].humidity , condition: jsonData.forecast.forecastday[i].hour[j].condition.text , 
            icon: jsonData.forecast.forecastday[i].hour[j].condition.icon,}
        }
    }

    return forecast
}
formdata()
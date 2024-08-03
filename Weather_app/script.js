const Userinput = document.querySelector(".search-input");
const userLocation = document.querySelector(".currentLoactionBtn");
// const searchButton = document.querySelector(".search-button");

const hour = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");
const day = document.querySelector("#day");
const dateElement = document.querySelector("#date");
const month = document.querySelector("#month");

const cityName = document.querySelector(".city-name");
const visibility = document.querySelector(".visibility");
const temperature = document.querySelector(".temp");
const feelsLike = document.querySelector(".feelsLike");
const Humidity = document.querySelector(".humidity");
const WindSpeed = document.querySelector(".windSpeed");
const Pressure = document.querySelector(".pressure");
const UV = document.querySelector(".uv");
const CurrentIcon = document.querySelector("#currIcon");

const dayOneTemperature = document.querySelector("#dayOneTemp");
const dayTwoTemperature = document.querySelector("#dayTwoTemp");
const dayThreeTemperature = document.querySelector("#dayThreeTemp");
const dayFourTemperature = document.querySelector("#dayFourTemp");
const dayFiveTemperature = document.querySelector("#dayFiveTemp");

const hour1time = document.querySelector("#hour1time");
const hour2time = document.querySelector("#hour2time");
const hour3time = document.querySelector("#hour3time");
const hour4time = document.querySelector("#hour4time");
const hour5time = document.querySelector("#hour5time");

const hour1temp = document.querySelector("#hour1temp");
const hour2temp = document.querySelector("#hour2temp");
const hour3temp = document.querySelector("#hour3temp");
const hour4temp = document.querySelector("#hour4temp");
const hour5temp = document.querySelector("#hour5temp");

const hour1wind = document.querySelector("#hour1wind");
const hour2wind = document.querySelector("#hour2wind");
const hour3wind = document.querySelector("#hour3wind");
const hour4wind = document.querySelector("#hour4wind");
const hour5wind = document.querySelector("#hour5wind");


setInterval(function () {
  // console.log("Hello");
  const date = new Date();
  const daysArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  hour.innerText = date.getHours();
  minutes.innerText = date.getMinutes();
  day.innerText = daysArray[date.getDay()];
  dateElement.innerText = date.getDate();
  month.innerText = monthArray[date.getMonth()];
}, 500);

Userinput.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    const location = Userinput.value.trim();

    if (location != "") {
      const data = await fetchWeather(location);
      // console.log(data)

      if (data != null) {
        updateDOM(data);
      }
      Userinput.value = "";
      const latitude = data.location.lat;
      const longitude = data.location.lon;

      const dailyforecastdata = await dailyforecast(latitude, longitude);

      if (dailyforecastdata != null) {
        // console.log(forecastdata[0]);
        dailyforecastUpdate(dailyforecastdata);
      } else {
        alert("null");
      }

      const hourlyforecastdata = await hourlyforecast(latitude, longitude);
      if (hourlyforecastdata != null) {
        hourlyforecastUpdate(hourlyforecastdata);
      }
    }
  }
});


userLocation.addEventListener("click", getUserLocation)

function getUserLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`
      fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
        const location = data[0].name;
        fetchWeather(location).then((weatherData) => {
          updateDOM(weatherData);
          const latitude = weatherData.location.lat;
          const longitude = weatherData.location.lon;
          dailyforecast(latitude, longitude).then((dailyforecastdata) => {
            dailyforecastUpdate(dailyforecastdata);
          });
          hourlyforecast(latitude, longitude).then((hourlyforecastdata) => {
            hourlyforecastUpdate(hourlyforecastdata);
          });
        });
      }).catch(() => {
        alert("Unable to retrieve location");
      });
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Permission denied.Please reset location permision to geant access.");
      }
    }
  )
}


function hourlyforecastUpdate(hourlyforecastdata) {
  const hourlyTemperatures = [
    hour1temp,
    hour2temp,
    hour3temp,
    hour4temp,
    hour5temp,
  ];
  const hourlyTime = [hour1time, hour2time, hour3time, hour4time, hour5time];
  const hourlyWind = [hour1wind, hour2wind, hour3wind, hour4wind, hour5wind];

  if (
    hourlyTemperatures.every((element) => element !== null) &&
    hourlyTime.every((element) => element !== null) &&
    hourlyWind.every((element) => element !== null)
  ) {
    hourlyforecastdata.slice(0, 5).forEach((data, index) => {
      const temperature = Math.floor(data.main.temp - 273.15);
      hourlyTemperatures[index].innerText = `${temperature}°C`;

      const windSpeed = Math.floor(data.wind.speed * 3.6);
      hourlyWind[index].innerText = `${windSpeed}km/h`;

      const iconId = data.weather[0].icon;
      const iconURL = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
      const iconElement = document.querySelector(`#hour${index + 1}Icon`);
      iconElement.src = iconURL;

      const forecastTime = new Date(data.dt_txt);
      const hour = forecastTime.getHours();
      const minute = forecastTime.getMinutes();
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      hourlyTime[index].innerText = timeString;
    });
  } else {
    console.error(
      "One or more hourly temperature, time or wind elements are null"
    );
  }
}

async function hourlyforecast(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

  const response = await fetch(URL);
  if (response.status == 400) {
    alert("Invalid location");
    return null;
  } else if (response.status == 200) {
    const jsonData = await response.json();
    const hourlyData = jsonData.list;

    // Get the current time
    const currentTime = new Date();

    // Filter the hourly data to only include updates after the current time
    const filteredHourlyData = hourlyData.filter((data) => {
      const forecastTime = new Date(data.dt_txt);
      return forecastTime > currentTime;
    });

    // Return the first 5 elements of the filtered array
    return filteredHourlyData.slice(0, 5);
  }
}

function dailyforecastUpdate(dailyforecastdata) {
  // const imageIcon = forecastdata[0].weather[0].icon;
  // const imageUrl = `https://openweathermap.org/img/wn/${imageIcon}@2x.png`;

  const dayTemperatures = [
    dayOneTemperature,
    dayTwoTemperature,
    dayThreeTemperature,
    dayFourTemperature,
    dayFiveTemperature,
  ];

  dailyforecastdata.slice(1, 6).forEach((data, index) => {
    const temperature = Math.floor(data.main.temp - 273.15);
    dayTemperatures[index].innerText = `${temperature}°C`;

    // Loop through the data.weather array
    data.weather.forEach((weatherData) => {
      const icon = weatherData.icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      // Update the icon for the current day
      const iconElement = document.querySelector(`#day${index + 1}Icon`);
      iconElement.src = iconUrl;
    });
  });

  const currdate = new Date();

  const dayDates = [
    dayOneDate,
    dayTwoDate,
    dayThreeDate,
    dayFourDate,
    dayFiveDate,
  ];
  const daysArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (i = 0; i < 5; i++) {
    const date = new Date(dailyforecastdata[i + 1].dt_txt);
    const weekdayName = daysArray[date.getDay()];
    dayDates[i].textContent = `${weekdayName} 
    ${date.getDate()} ${monthArray[date.getMonth()]} `;
  }
}

async function dailyforecast(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

  const response = await fetch(URL);
  if (response.status == 400) {
    alert("Invalid location");

    return null;
  } else if (response.status == 200) {
    const json = await response.json();

    const uniqueForecastDays = [];

    const fiveDaysForecast = json.list.filter((forecast) => {
      const forecastDay = new Date(forecast.dt_txt).getDate();

      if (!uniqueForecastDays.includes(forecastDay)) {
        return uniqueForecastDays.push(forecastDay);
      }
    });

    return fiveDaysForecast;
  }
}

function updateDOM(data) {
  const city = data.location.name;
  const temp = Math.floor(data.current.temp_c) + "°C";
  const condition = data.current.condition.text;
  const feelLike = Math.floor(data.current.feelslike_c) + "°C";
  const humidity = data.current.humidity;
  const windspeed = data.current.wind_kph;
  const pressure = data.current.pressure_mb;
  const uv = data.current.uv;
  const currIcon = data.current.condition.icon;
  const iconUrl = `https:${currIcon}`; // Note the https: prefix

  CurrentIcon.src = iconUrl; // Update the icon src attribute
  /******************* UPDATE DOM ************************* */
  cityName.innerText = city;
  visibility.innerText = condition;
  temperature.innerText = temp;
  feelsLike.innerText = feelLike;
  Humidity.innerText = humidity + "%";
  WindSpeed.innerText = windspeed + " km/h";
  Pressure.innerText = pressure + " hPa";
  UV.innerText = uv + " UV";
}

async function fetchWeather(location) {
  const URL = `https://api.weatherapi.com/v1/current.json?key=b6e172c6260c4391b0f52423241707&q=${location}&aqi=no`;

  const response = await fetch(URL);
  if (response.status == 400) {
    alert("location is invalid");
    return null;
  } else if (response.status == 200) {
    const json = await response.json();
    // console.log(json);
    return json;
  }
}
// const date1 = new Date();
// console.log(date1.getDate())''

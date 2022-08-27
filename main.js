// https://restcountries.com/v3.1/name/{name}
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m

const weatherCode = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense intensity drizzle",
  56: "Light freezing drizzle",
  57: "Dense intensity freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy intensity rain",
  66: "Light freezing rain",
  67: "Heavy intensity freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy intensity snow fall",
  77: "Snow grains",
  80: "Slight rain shower",
  81: "Moderate rain shower",
  82: "Violent rain shower",
  85: "Slight snow shower",
  86: "Moderate snow shower",
  95: "Thunderstorm slight/moderate",
  96: "Thunderstorm slight with hail",
  99: "Thunderstorm heavy with hail",
};

const form = document.querySelector(".form-weather");
const date = document.querySelector(".date");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const country = document.getElementById("country").value;

    if (!country) return;

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
    );

    document.getElementById("country").value = "";

    if (!res.ok) throw new Error(`Country no found ${res.status}`);
    const [data] = await res.json();
    const [capital] = data.capital;

    const lat = data.capitalInfo.latlng[0].toFixed(2);
    const lng = data.capitalInfo.latlng[1].toFixed(2);
    const flag = data.flags.svg;
    console.log(data);
    const timezoneCode = data.timezones[0].slice(0, 3);
    const langISO = data.cca2.toLowerCase();
    console.log(timezoneCode);
    await getWeather(lat, lng, timezoneCode, flag, capital, langISO);
  } catch (err) {
    console.error(err);
  }
});

const getWeather = async (lat, lng, timezoneCode, flag, capital, langISO) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=${[
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "precipitation_hours",
        "sunrise",
        "sunset",
        "windspeed_10m_max",
      ]}&timezone=${timezoneCode}`
    );
    if (!res.ok) throw new Error(`Data not found ${res.status}`);
    const data = await res.json();

    const temperatureUnit = data.daily_units.temperature_2m_max;
    const precipitationUnit = data.daily_units.precipitation_sum;
    const precipitationUnitHour = data.daily_units.precipitation_hours;
    const windUnit = data.daily_units.windspeed_10m_max;
    const { current_weather } = data;

    // ! time;
    const now = new Date(current_weather.time);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    date.textContent = new Intl.DateTimeFormat(langISO).format(now);

    console.log(data);
    // for (let i = 0; i < 7; i++) {}
  } catch (err) {
    console.error(err);
  }
};

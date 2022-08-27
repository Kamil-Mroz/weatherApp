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
const time = document.querySelector(".time");
const error = document.querySelector(".error");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    date.textContent = "";
    const country = document.getElementById("country").value;

    if (!country) return;

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
    );

    document.getElementById("country").value = "";

    if (!res.ok) throw new Error(`Country not found ${res.status}`);
    const [data] = await res.json();
    const [capital] = data.capital;

    const lat = data.capitalInfo.latlng[0].toFixed(2);
    const lng = data.capitalInfo.latlng[1].toFixed(2);
    const flag = data.flags.svg;

    await getWeather(lat, lng, flag, capital);
  } catch (err) {
    displayError(err);
  }
});

const getWeather = async (lat, lng, flag, capital) => {
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
      ]}&timezone=auto`
    );
    if (!res.ok) throw new Error(`Data not found ${res.status}`);
    displayError("");
    const data = await res.json();

    const {
      current_weather: weather,
      daily: {
        precipitation_hours: precipitationH,
        precipitation_sum: precipitationSum,
        sunrise,
        sunset,
        temperature_2m_max: tempMax,
        temperature_2m_min: tempMin,
        time: day,
        windspeed_10m_max: windMax,
      },
      daily_units,
    } = data;
    const celsius = daily_units.temperature_2m_max;
    const mm = daily_units.precipitation_sum;
    const h = daily_units.precipitation_hours;
    const wind = daily_units.windspeed_10m_max;

    // ! time;
    const now = new Date(weather.time);
    const options = {
      hour: "numeric",
      minute: "numeric",
      seconds: "numeric",
      day: "numeric",
      month: "2-digit",
      year: "numeric",
      weekday: "long",
    };
    const locale = navigator.language;

    date.textContent = new Intl.DateTimeFormat(locale, options).format(now);
    console.log(data);
    for (let i = 0; i < 7; i++) {
      // createCard(precipitationH[i],
      //   precipitationSum[i],
      //   sunrise[i],
      //   sunset[i],
      //   day[i],
      //   tempMax[i],
      //   tempMin[i],
      //   windMax[i]);
      console.log(day[i]);
    }
  } catch (err) {
    displayError(err);
  }
};

function createCard(
  precipitationH,
  precipitationSum,
  sunrise,
  sunset,
  day,
  tempMax,
  tempMin,
  windMax
) {
  const div = document.createElement("div");
  div.classList.add("card");

  const innerCard = `
    
    
    `;

  div.innerHTML = innerCard;
}

function displayError(message) {
  error.textContent = message;
}

// https://restcountries.com/v3.1/name/{name}
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m

const form = document.querySelector(".form-weather");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const country = document.getElementById("country").value;
    if (!country) return;

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
    );
    if (!res.ok) throw new Error(`Country no found ${res.status}`);
    const [data] = await res.json();
    console.log(data);
    const lat = data.latlng[0];
    const lng = data.latlng[1];
    const [shortTimezone, longTimezone] = data.timezones;

    getWeather(lat, lng, shortTimezone, longTimezone);
  } catch (err) {
    console.error(err);
  }
});

const getWeather = async (lat, lng, short, long) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=${[
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_hours",
      "sunrise",
      "sunset",
      "windspeed_10m_max",
    ]}&timezone=${short}`
  );
  const data = await res.json();
};

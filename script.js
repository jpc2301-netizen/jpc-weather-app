const lowEl = document.getElementById("low");
const forecastEl = document.getElementById("forecast");

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const placeEl = document.getElementById("place");
const descEl = document.getElementById("desc");
const tempEl = document.getElementById("temp");
const feelsEl = document.getElementById("feels");
const windEl = document.getElementById("wind");
const highEl = document.getElementById("high");

const STORAGE_KEY = "weather-app-last-city-v1";

const WEATHER_CODE = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm",
};

init();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  await fetchAndRender(city);
});

async function init() {
  const last = localStorage.getItem(STORAGE_KEY);
  if (last) {
    cityInput.value = last;
    await fetchAndRender(last);
  }
}

async function fetchAndRender(city) {
  setStatus("Loading weather...", false);
  resultEl.classList.add("hidden");

  try {
    const geo = await geocodeCity(city);
    if (!geo) {
      setStatus("City not found. Try a different spelling.", true);
      return;
    }

    const weather = await getForecast(geo.latitude, geo.longitude);

    // Current
    const current = weather.current;
    const daily = weather.daily;

    placeEl.textContent = `${geo.name}${geo.admin1 ? ", " + geo.admin1 : ""}${geo.country ? ", " + geo.country : ""}`;
    descEl.textContent = WEATHER_CODE[current.weather_code] || `Weather code: ${current.weather_code}`;

    tempEl.textContent = round(current.temperature_2m);
    feelsEl.textContent = round(current.apparent_temperature);
    windEl.textContent = round(current.wind_speed_10m);

    highEl.textContent = round(daily.temperature_2m_max[0]);
    lowEl.textContent = round(daily.temperature_2m_min[0]);
    renderForecast(daily);


    localStorage.setItem(STORAGE_KEY, city);

    setStatus("", false);
    resultEl.classList.remove("hidden");
  } catch (err) {
    setStatus("Something went wrong. Try again in a moment.", true);
  }
}

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "crimson" : "inherit";
}

function round(n) {
  return Math.round(Number(n));
}

// Open-Meteo geocoding (no key)
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocode failed");
  const data = await res.json();
  return data?.results?.[0] || null;
}

// Open-Meteo forecast (no key)
async function getForecast(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Forecast failed");
  return await res.json();
}function renderForecast(daily) {
  // daily.time is an array of YYYY-MM-DD
  // We'll show the next 5 days (starting from today)
  const daysToShow = 5;

  forecastEl.innerHTML = "";

  for (let i = 0; i < daysToShow; i++) {
    const date = daily.time[i];
    const hi = round(daily.temperature_2m_max[i]);
    const lo = round(daily.temperature_2m_min[i]);

    const card = document.createElement("div");
    card.className = "day";

    card.innerHTML = `
      <div class="date">${formatDate(date)}</div>
      <div class="hi">${hi}°</div>
      <div class="lo">${lo}°</div>
    `;

    forecastEl.appendChild(card);
  }
}

function formatDate(yyyyMmDd) {
  const d = new Date(yyyyMmDd);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}



# Weather App ☁️

A simple weather app that lets you search any city and view current conditions plus today's high/low.

## Live Demo
👉 https://jpc-weather-app.netlify.app/

## Features
- City search
- Current temperature, "feels like", wind speed
- Today's high/low temperatures
- Remembers last searched city (localStorage)
- No API key required (Open-Meteo)

## Tech Stack
- HTML
- CSS
- JavaScript
## 🧠 Technical Highlights
- Integrated two external endpoints (geocoding + forecast) to fetch weather by city name
- Implemented asynchronous data fetching with `fetch()` and loading/error UI states
- Rendered dynamic UI updates based on API responses (current + daily forecast)
- Persisted user experience by saving the last searched city in `localStorage`
- Deployed and maintained via GitHub → Netlify continuous deployment
## ⚙️ Challenges & Solutions

**Challenge:** Converting a user’s city search into coordinates for a forecast API  
**Solution:** Used a geocoding request first, then passed latitude/longitude to the forecast endpoint

**Challenge:** Avoiding broken UI when a city isn’t found or an API request fails  
**Solution:** Added defensive checks and clear status messaging for error cases

**Challenge:** Keeping the app convenient on repeat visits  
**Solution:** Stored the last searched city in `localStorage` and auto-loaded it on refresh

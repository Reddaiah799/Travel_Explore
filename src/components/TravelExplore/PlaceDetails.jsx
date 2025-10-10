import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
const WEATHER_API_KEY = "85eec4c2ac8553de3117aa061a5448c8";
const TIMEZONE_API_KEY = "B1VTLYIXZE98";

export function PlaceDetails() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [time, setTime] = useState(null);
  const [timeError, setTimeError] = useState(false);
  const [loadingTime, setLoadingTime] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/places/${id}`);
        setPlace(res.data);

        const { city, country } = res.data.location;
        fetchWeatherAndTime(city, country);
      } catch (err) {
        console.error("Failed to load place details", err);
      }
    };

    fetchData();
  }, [id]);

  // Fetch weather and local time
  const fetchWeatherAndTime = useCallback(async (city, country) => {
    try {
      setLoadingWeather(true);
      setLoadingTime(true);
      setWeatherError(false);
      setTimeError(false);

      // 1. Geocoding
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city
        )},${encodeURIComponent(country)}&limit=1&appid=${WEATHER_API_KEY}`
      );

      if (!geoRes.data.length) throw new Error("Location not found");

      const { lat, lon } = geoRes.data[0];

      // 2. Fetch both weather and time in parallel
      const [weatherRes, timeRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        ),
        axios.get(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
        ),
      ]);

      // Set weather and time
      setWeather(weatherRes.data);
      setTime(timeRes.data.formatted);
    } catch (error) {
      console.error("Error fetching weather or time:", error.message);
      setWeatherError(true);
      setTimeError(true);
    } finally {
      setLoadingWeather(false);
      setLoadingTime(false);
    }
  }, []);

  if (!place) return <p>Loading place details...</p>;

  const renderWeather = () => {
    if (loadingWeather) return <p>Loading weather...</p>;
    if (weatherError || !weather) return <p className="text-danger">Failed to load weather.</p>;

    const { main, weather: wInfo, wind } = weather;
    const icon = wInfo[0].icon;

    return (
      <div>
        <p>🌡 Temperature: {main.temp} °C</p>
        <p>🌤 Conditions: {wInfo[0].description}</p>
        <p>💧 Humidity: {main.humidity}%</p>
        <p>🌬 Wind Speed: {wind.speed} m/s</p>
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="Weather icon"
          style={{ width: "80px" }}
        />
      </div>
    );
  };

  const renderTime = () => {
    if (loadingTime) return <p>Loading time...</p>;
    if (timeError || !time) return <p className="text-danger">Failed to fetch local time.</p>;

    const formatted = new Date(time.replace(" ", "T")).toLocaleString();
    return <p>{formatted}</p>;
  };

  return (
    <div className="container mt-4">
      <Link to="/user-dashboard" className="btn btn-secondary mb-3">
        ← Back to Dashboard
      </Link>

      <h2>{place.name}</h2>
      <p>{place.description}</p>
      <p>
        <strong>Location:</strong> {place.location.city}, {place.location.country}
      </p>

      {/* Images */}
      <div className="mb-4 d-flex flex-wrap gap-3">
        {place.images && place.images.length > 0 ? (
          place.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${place.name} ${idx + 1}`}
              style={{
                width: "250px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>

      {/* Embedded Video */}
      {place.videos && place.videos.length > 0 ? (
        <div className="mb-4">
          <h4>Video</h4>
          <iframe
            src={`${place.videos[0]}${place.videos[0].includes("?") ? "&" : "?"}autoplay=0`}
            width="100%"
            height="400"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Video of ${place.name}`}
            style={{ borderRadius: "8px" }}
          />
        </div>
      ) : (
        <p>No video available.</p>
      )}

      <hr />

      {/* Weather Section */}
      <div className="mb-3">
        <h4>Current Weather</h4>
        {renderWeather()}
      </div>

      <hr />

      {/* Time Section */}
      <div>
        <h4>Current Local Time</h4>
        {renderTime()}
      </div>
    </div>
  );
}

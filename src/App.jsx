import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import errorpng from "./Img/404.png"

function App() {
  const [location, setLocation] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (searchClicked && location) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${location}&days=4&aqi=yes&alerts=yes`)
          setWeatherData(response.data)
          setError(null);
          console.log(response)
        } catch (error) {
          setError(error);
          console.log(error)
        }
      };
      fetchData();
    }
  }, [searchClicked, location]);
  

  const handleLocationChange = (event) => {
    setLocation(event.target.value)
    setWeatherData(null);
    setSearchClicked(false);
  }

  const handleSearch = () => {
    if (location) {
      setSearchClicked(true);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  console.log(import.meta.env.VITE_WEATHER_API)

  return (
    <div className='body w-full h-screen mx-auto flex justify-center items-center flex-col overflow-hidden'>
        <h1 className='title font-bold text-4xl text-white'> Hava Proqnozu</h1>
      <div className='app-container w-2/3 px-1 py-5 rounded-2xl mx-auto m-5 flex flex-col items-center justify-center text-center gap-4'>
        <div className='input-container w-2/3 flex justify-center items-center relative p-2' >
        
        <i className="fa-solid fa-location-dot absolute left-3 text-white m-2"></i>
          
          <input
            className='location-input w-full ps-8 bg-transparent text-white font-medium border rounded-lg outline-none p-3'
            type='text'
            placeholder='Şəhər adı yazın'
            value={location}
            onChange={handleLocationChange}
            onKeyDown={handleKeyDown}
          />
        <i className="fa-solid fa-magnifying-glass cursor-pointer p-2 rounded-xl absolute right-3 text-white m-2" onClick={handleSearch}></i>
        </div>
        <div className={`weather-container w-full flex flex-col justify-center items-center ${weatherData ? 'expanded' : ''}`}>
          {searchClicked && error && location &&
            <div className="error-container d-flex justify-center items-center p-2 w-100">
              <img src={errorpng} alt="404" width={400} />
              <h3 className='text-white text-2xl'>Location not found!</h3>
            </div>
          }
          {searchClicked && weatherData && !error && location && (
            <div className='weather-data-container w-full flex flex-wrap justify-evenly'>
              {weatherData.forecast.forecastday.map((day) => (
                <div className='forecast-day text-center relative text-white flex flex-col justify-center items-center p-5 gap-3 rounded-lg w-1/5' key={day.date}>
                  <h2 className='date'>{day.date}</h2>
                  <img className='weather-icon w-20' src={day.day.condition.icon} alt={day.day.condition.text} />
                  <h3 className='temperature'>{day.day.avgtemp_c}  <span className="text-xs ms-1 absolute">°C</span></h3>
                  <h3 className='temperature capitalize'>{day.day.condition.text}</h3>
                  <p className='temperature'>{day.day.maxtemp_c} °/ {day.day.mintemp_c}°</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App

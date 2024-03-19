import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import errorpng from "./Img/404.png"
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { Cursor, useTypewriter } from 'react-simple-typewriter'

function App() {
  const [location, setLocation] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);

  const [text] = useTypewriter({
    words: ['Hava Proqnozu', 'Weather Forecast'],
    loop: {},
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 3000
  });

  const [placeholder] = useTypewriter({
    words: ['Şəhər Axtarın', 'Search City'],
    loop: {},
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 3000
  });

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

  return (
    <div className='body w-full overflow-hidden h-screen mx-auto flex justify-center  items-center flex-col'>
      <h1 className='title font-bold text-4xl text-white m-2 animate__animated animate__fadeInDown'>
        {text}
        <Cursor />
      </h1>
      <div className={`app-container rounded-2xl overflow-y-scroll animate__animated animate__fadeInUp ${weatherData ? 'expanded' : ''}`}>
        <div className='w-100 px-1 rounded-2xl mx-auto m-5 flex flex-col items-center justify-center text-center gap-4'>
          <div className='input-container pt-4 flex justify-center items-center relative p-2' >
            <i className="fa-solid fa-location-dot absolute left-3 text-white m-2"></i>
            <input
              className='location-input w-full ps-8 bg-transparent text-white font-medium border rounded-lg outline-none p-3'
              type='text'
              placeholder={placeholder}
              value={location}
              onChange={handleLocationChange}
              onKeyDown={handleKeyDown}
            />
            
            <i className="fa-solid fa-magnifying-glass cursor-pointer p-2 rounded-xl absolute right-3 text-white m-2 " onClick={handleSearch}></i>
          </div>
          <div className={`weather-container w-full flex flex-col justify-center items-center`}>
            {searchClicked && error && location &&
              <TrackVisibility>
                {({ isVisible }) =>

                  <div className={isVisible ? "animate__animated animate__fadeInUp error-container d-flex justify-center items-center p-2 w-100" : ''}>
                    <img src={errorpng} alt="404" width={400} />
                    <h3 className='text-white text-2xl'>Location not found!</h3>
                  </div>
                }
              </TrackVisibility>
            }
            {searchClicked && weatherData && !error && location && (
              <TrackVisibility>
                {({ isVisible }) =>
                  <div className={isVisible ? "animate__animated animate__fadeInUp w-full " : ''}>
                    <div className='weather-data-container w-full flex flex-wrap justify-evenly gap-4'>
                      {weatherData.forecast.forecastday.map((day) => (
                        <div className='forecast-day text-center relative text-white flex flex-col justify-center items-center p-5 mb-3 gap-3 rounded-lg w-52' key={day.date}>
                          <h2 className='date'>{day.date}</h2>
                          <img className='weather-icon w-20' src={day.day.condition.icon} alt={day.day.condition.text} />
                          <h3 className='temperature'>{day.day.avgtemp_c}  <span className="text-xs ms-1 absolute">°C</span></h3>
                          <h3 className='temperature capitalize'>{day.day.condition.text}</h3>
                          <p className='temperature'>{day.day.maxtemp_c} °/ {day.day.mintemp_c}°</p>
                        </div>
                      ))}
                    </div>
                  </div>}
              </TrackVisibility>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

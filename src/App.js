import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [temp, setTemp] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [city, setCity] = useState('');
  const [isReady, setReady] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const API_KEY = 'dab26d6628994dab771512bec2b0602b';

  useEffect(() => { 
    if (!latitude || !longitude) return; 
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      .then(result => result.json())
      .then(jsonresult => {
        setTemp(jsonresult.main.temp);
        setDesc(jsonresult.weather[0].main);
        setIcon(jsonresult.weather[0].icon);
        setSunrise(new Date(jsonresult.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(jsonresult.sys.sunset * 1000).toLocaleTimeString());
        setCity(jsonresult.name); 
        setReady(true);
      })
      .catch(err => console.error(err));
  }, [latitude, longitude]);

  useEffect(() => { 
    if (!searchCity) return; 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`)
      .then(result => result.json())
      .then(jsonresult => {
        setTemp(jsonresult.main.temp);
        setDesc(jsonresult.weather[0].main);
        setIcon(jsonresult.weather[0].icon);
        setSunrise(new Date(jsonresult.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(jsonresult.sys.sunset * 1000).toLocaleTimeString());
        setCity(jsonresult.name); 
        setReady(true);
      })
      .catch(err => console.error(err));
  }, [searchCity]);

  const handleLatitudeChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= -90 && value <= 90) {
      setLatitude(value);
      setErrorMessage(null); // Clear error if any
    } else {
      setErrorMessage('Invalid latitude. Please enter a number between -90 and 90.');
    }
  };

  const handleLongitudeChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= -180 && value <= 180) {
      setLongitude(value);
      setErrorMessage(null); // Clear error if any
    } else {
      setErrorMessage('Invalid longitude. Please enter a number between -180 and 180.');
    }
  };

  const handleSearchCityChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleSubmit = () => {
    setReady(false); 
  };

  const temperatureColor = temp < 15 ? 'alert-primary' : temp < 25 ? 'alert-warning' : 'alert-danger';

  return (
    <div className="container mt-5">
      <div className="bg-dark text-white">
        <h1 className="text-center mb-4">My Weather App</h1>
      </div>
      <div className="row justify-content-center">
        <div align="center">
          <div className="col-lg-6">
            <div align="center">
              <div className="form-group">
                <h2 className="text-primary">Search by City</h2>
                <label htmlFor="searchCity">City:</label>
                <input type="text" className="form-control" id="searchCity" value={searchCity} onChange={handleSearchCityChange} />
              </div>
              <div className="form-group">
                <h2 className="text-primary">Put coordinates</h2>
                <label htmlFor="latitude">Latitude:</label>
                <input type="text" className="form-control" id="latitude" value={latitude} onChange={handleLatitudeChange} />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude:</label>
                <input type="text" className="form-control" id="longitude" value={longitude} onChange={handleLongitudeChange} />
              </div>
              {errorMessage && <div className="text-danger">{errorMessage}</div>}
              <button className="btn btn-primary mb-3" onClick={handleSubmit}>
                Submit
              </button>
              <br/><br/>
              {isReady ? (
                <div className={`alert ${temperatureColor}`} role="alert">
                  <h4 className="alert-heading">City: {city}</h4>
                  <p className="mb-1">Temperature: {temp} °C</p>
                  <p className="mb-1">Main: {desc}</p>
                  <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather icon" className="mb-3" />
                  <p className="mb-1">Sunrise: {sunrise}</p>
                  <p className="mb-0">Sunset: {sunset}</p>
                </div>
              ) : (
                <div className="text-center">Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

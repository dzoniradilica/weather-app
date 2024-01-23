const form = document.querySelector('form');
const weatherInfo = document.querySelector('.weather-info');
const parametarsInfo = document.querySelector('.parameters-card');
const day1 = document.querySelector('.day1');
const day2 = document.querySelector('.day2');
const day3 = document.querySelector('.day3');

let searchValue;
const apiKey = '7249f54fe470767375e808d6f72425f4';

class Weather {
  searchValue;
  apiKey = '7249f54fe470767375e808d6f72425f4';

  constructor() {
    form.addEventListener('submit', this.submitForm.bind(this));
    day1.addEventListener('click', this.clickDay1.bind(this));
    day2.addEventListener('click', this.clickDay2.bind(this));
    day3.addEventListener('click', this.clickDay3.bind(this));
    this.getPosition();
  }

  renderDay(date) {
    return new Intl.DateTimeFormat(navigator.language, {
      weekday: 'long',
      day: 'numeric',
    }).format(date);
  }

  renderFullDate(date) {
    return new Intl.DateTimeFormat(navigator.language, {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  weatherInformations(img, weather, data) {
    let weatherInformations = `
      <img
        class="img-weather"
        src=${img}
        alt=""
        style="max-width: 100px"
      />
      <h1 class="temp">${(weather.main.temp - 273.15).toFixed(2)}°C</h1>
      <span value="celsius" id="celsius" class="idk">°C</span>
      <span  value="fahrenheit" id="fahrenheit" class="idk">°F</span>
      <span value="kelvin" id="kelvin" class="idk">K</span>
      <p class="day">${this.renderDay(Date.parse(weather.dt_txt))}</p>
      <p class="date">${this.renderFullDate(Date.parse(weather.dt_txt))}</p>
      <div class="line"></div>
      <p class="city">${data.city.name}</p>
    `;

    weatherInfo.insertAdjacentHTML('afterbegin', weatherInformations);
  }

  changeTemp(weather) {
    let h1 = document.querySelector('.temp');
    let celsius = document.querySelector('#celsius');
    let fahrenheit = document.querySelector('#fahrenheit');
    let kelvin = document.querySelector('#kelvin');

    celsius.addEventListener('click', () => {
      h1.textContent = (weather.main.temp - 273.15).toFixed(2) + '°C';
    });

    fahrenheit.addEventListener('click', () => {
      h1.textContent = `${weather.main.temp.toFixed(2)}°F`;
    });

    kelvin.addEventListener('click', () => {
      h1.textContent =
        (((weather.main.temp - 32) * 5) / 9 + 273.15).toFixed(2) + 'K';
    });
  }

  parametarsInformations(weather) {
    const parametarsRow = `
          <div class="row">
          <div class="col-md-3 blue-card">
            <h5>Wind</h5>
            <h3>${weather.wind.speed} KM/H</h3>
          </div>
    
          <div class="col-md-3 blue-card">
            <h5>Humadity</h5>
            <h3>${weather.main.humidity}%</h3>
          </div>
    
          <div class="col-md-3 blue-card">
            <h5>Real feel</h5>
            <h3>${(weather.main.feels_like - 273.15).toFixed(2)}C</h3>
          </div>
        </div>
    
        <div class="row">
          <div class="col-md-3 blue-card">
            <h5>Temp Max/Temp Min</h5>
            <p class="bigger">&uarr; ${(weather.main.temp_max - 273.15).toFixed(
              2
            )}/ &darr;${(weather.main.temp_min - 273.15).toFixed(2)}</p>
          </div>
    
          <div class="col-md-3 blue-card">
            <h5>Pressure</h5>
            <h3>${weather.main.pressure} mb</h3>
          </div>
    
          <div class="col-md-3 blue-card">
            <h5>Clouds</h5>
            <h3>${weather.clouds.all}</h3>
          </div>
        </div>
          `;

    parametarsInfo.insertAdjacentHTML('afterbegin', parametarsRow);
  }

  renderWeather(weather1, data) {
    let imgSrc;

    if (weather1.weather[0].main === 'Clouds') {
      imgSrc = 'images/cloud.png';
    }
    if (weather1.weather[0].main === 'Clear') {
      imgSrc = 'images/clear.png';
    }
    if (weather1.weather[0].main === 'Snow') {
      imgSrc = 'images/snow.png';
    }
    if (weather1.weather[0].main === 'Rain') {
      imgSrc = 'images/rain.png';
    }
    if (weather1.weather[0].main === 'Mist') {
      imgSrc = 'images/mist.png';
    }

    this.weatherInformations(imgSrc, weather1, data);

    this.parametarsInformations(weather1);

    this.changeTemp(weather1);
  }

  getJSON() {
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=${apiKey}`
    ).then(response => {
      //Pokusaj ubacivanja greske
      if (response.status === 400) return;
      if (response.status === 404) {
        let error404 = `
          <div class="editError">
            <img
              class="error-weather"
              src=images/404.png
              alt=""
              style="max-width: 200px"
            />
          </div>
          
          `;
        throw new Error(error404);
      }

      return response.json();
    });
  }

  submitForm(e) {
    e.preventDefault();

    searchValue = document.querySelector('#search-bar').value;

    if (!searchValue) return;

    this.getJSON()
      .then(data => {
        if (!data) return;

        let weather1 = data.list[0];

        if (!weather1) return;

        this.renderWeather(weather1, data);
      })
      .catch(err => {
        weatherInfo.insertAdjacentHTML('afterbegin', err.message);
      });

    weatherInfo.textContent = '';
    parametarsInfo.textContent = '';
  }

  AEL(num) {
    this.getJSON().then(data => {
      let weather1 = data.list[num];

      this.renderWeather(weather1, data);
    });

    weatherInfo.textContent = '';
    parametarsInfo.textContent = '';
  }

  clickDay1() {
    if (!searchValue) return;
    this.AEL(0);
  }

  clickDay2() {
    if (!searchValue) return;
    this.AEL(1);
  }

  clickDay3() {
    if (!searchValue) return;
    this.AEL(2);
  }

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const apiKey1 = 'bdc_0473a0b9c9b84fa9a8ff3088d0e2aef1';

          fetch(
            `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${apiKey1}`
          )
            .then(response => response.json())
            .then(data => {
              console.log(data);
              const city = data.city;
              return fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
              )
                .then(response => response.json())
                .then(data2 => {
                  const weather1 = data2.list[0];

                  weatherInfo.textContent = '';
                  parametarsInfo.textContent = '';

                  this.renderWeather(weather1, data2);
                });
            });
        },
        () => {
          alert(
            'Ako zelis da dobijes prognozu iz svog grada, moras odobriti lokaciju'
          );
        }
      );
    }
  }
}

let weather = new Weather();

const fs = require("fs");
const { default: axios } = require("axios");

class Searches {
  history = [];
  dbPath = "./db/database.json";
  constructor() {
    this.readDB();
  }
  get historyCapitalize() {
    return this.history.map((place) => {
      let letter = place.split(" ");
      letter = letter.map((p) => {
        return p[0].toUpperCase() + p.substring(1);
      });

      return letter.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,

      limit: 5,
    };
  }
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
    };
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });
      const response = await instance.get();
      return response.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weatherPlace(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const response = await instance.get();

      const { weather, main } = response.data;
      //console.log(response.data.main);
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  addHistory(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }
    this.history = this.history.slice(0, 5);
    this.history.unshift(place.toLocaleLowerCase());

    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return;
    }
    const info = fs.readFileSync(this.dbPath, "utf8");
    const data = JSON.parse(info);
    this.history = data.history;
  }
}
module.exports = Searches;

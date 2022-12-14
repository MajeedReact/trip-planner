var path = require("path");
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

console.log(`Your API key is ${process.env.PIXA_KEY}`);

const app = express();
app.use(cors());

// to use json
app.use(bodyParser.json());
// to use url encoded values
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

const geonameAPI = async (req, res) => {
  //encodeURIComponent convert a string to a valid string for url (adds %20 for spaces automatically)
  const city = encodeURIComponent(req.body.city);
  //api's url
  const geonameURL = `http://api.geonames.org/searchJSON?q=${city}&username=${process.env.GEONAME_KEY}`;
  const response = await fetch(geonameURL);

  const result = await response.json();
  // check if there is no result with entered city
  if (result.geonames.length < 1) {
    res.status(404).send();
    //exit out of function
    return;
  }

  //return lat, lng, country, city, days
  //main object
  const resultObj = {
    city: result.geonames[0].name,
    country: result.geonames[0].countryName,
    lat: result.geonames[0].lat,
    lng: result.geonames[0].lng,
    days: req.body.days,
    date: req.body.date,
  };
  return resultObj;
};

const pixaAPI = async (result) => {
  const pixaURL = `https://pixabay.com/api/?key=${process.env.PIXA_KEY}&q=${result.city}&image_type=photo`;
  const response = await fetch(pixaURL);
  const responseJSON = await response.json();
  result.imgURL = responseJSON.hits[0].webformatURL;

  return result;
};

function callingApi(req, res) {
  return geonameAPI(req, res)
    .then(function (result) {
      if (result == undefined) {
        //if no result aka city was not found simply exit
        throw "City not found";
      }
      return weatherAPI(result);
    })
    .then(async function (data) {
      const result = await pixaAPI(data);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
}
app.post("/weather", callingApi);
const weatherAPI = async (result) => {
  const weatherURL = `https://api.weatherbit.io/v2.0/current?lat=${result.lat}&lon=${result.lng}&key=${process.env.WEATHER_KEY}`;
  const forcastURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${result.city}&key=${process.env.WEATHER_KEY}`;
  //check if a trip within a week
  if (result.days < 7) {
    const response = await fetch(weatherURL);
    const weatherResult = await response.json();
    //appending values to object
    result.temp = weatherResult.data[0].temp + " Celsius";
    result.description = weatherResult.data[0].weather.description;
    result.sunrise = weatherResult.data[0].sunrise;
    result.sunset = weatherResult.data[0].sunset;

    return result;
  } else {
    //call api for weather forcast
    const response = await fetch(forcastURL);
    const forcastResult = await response.json();

    //get highest temp
    //get lowest temp
    result.high = forcastResult.data[0].high_temp;
    result.low = forcastResult.data[0].low_temp;
    result.description = forcastResult.data[0].weather.description;
    console.log(result);
    return result;
  }
};

app.post("/analysis", callingApi);

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log(`App running on http://localhost:${8081}`);
});

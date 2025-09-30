// initialize server
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

// connect static files
app.use(express.static("public"));

//initialize body parrser for collecting user text input
app.use( bodyParser.urlencoded( { extended: true } ) );

// function to handle weather search
app.post('/search', async ( request, response ) => {

  // initialize request info
  const key = "4da26813f53560e4146b7f49e09ca22e";
  const location = request.body.location;

  // attempt to call the URL for search
  try 
  {
    //set url to API
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=imperial`;
    let searchResult = await axios.get( url );
    let result = searchResult.data

    //get next three days of weather
    // API gets weather in 3hr increments 8 = 24hr
    let day1Weather = result.list[ 8 ];
    let day2Weather = result.list[ 16 ];
    let day3Weather = result.list[ 24 ];

    //let weatherReport = tomorrowWeather.weather[0].description;

    // render the result to search result page
    response.render( "search.ejs", 
    {
      // result object to hold display items
      result: 
      { 
        // city name
        location: result.city.name,
        // list of 3 day forecast result
        fullReport: [
          { temp: day1Weather.main.temp, report: day1Weather.weather[0].description },
          { temp: day2Weather.main.temp, report: day2Weather.weather[0].description },
          { temp: day3Weather.main.temp, report: day3Weather.weather[0].description } ]        
      }

    });
  }

  // handle errors recieved from the weather API and post them to the console
  catch ( error )
  {
    // display error console/browser console
    console.error(error.message);

    // display error back to user
    response.render( "search.ejs", { result: null });
  }

});

//handle initial page direction
app.get("/", ( request, response ) => {
  // display index
  response.render( "index.ejs" );
  
});

//start server listening
app.listen(3000, () => console.log("Server @: http://localhost:3000"));

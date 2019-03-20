const request = require('request');

const forecast = (lat, long, callback) => {
    const url = `https://api.darksky.net/forecast/90f685f90029681d6ed9cb4461c2b876/${lat},${long}`;

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback("unable to connect to weather forecast", undefined);
        } else if (body.error) {
            callback("Unable to find location, try another search", undefined);
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain`)
        }
    })
}

module.exports = forecast;
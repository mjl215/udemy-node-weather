const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./geocode');
const forecast = require('./forecast');

const app = express();
// heroku 
const port = process.env.PORT || 3000; 

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//set up static directory
app.use(express.static(publicDirectoryPath));


app.get('', (req, res) => {
    res.render('index', {
        title: 'weather',
        name: 'Andrew Mead',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Andrew Mead',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'this is some helpfull text',
        name: 'Andrew Mead'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "you must provide an address"
        })
    }

    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
    
        if(error){
            return res.send({error});
        } 
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error});
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address,
            });
          })
    })
    
    
} )



app.get('/products', (req, res) =>{

    if(!req.query.search){
        return res.send({
            error: "you much provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) =>{
    res.render('404',{
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Andrew Mead'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        errorMessage: 'Page not found',
        title: '404',
        name: 'Andrew Mead'
    })
})


// app.com
// app.com/help
// app.com/about

app.listen(port, () => {
    console.log('server is up on port ' + port);
});
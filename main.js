const express = require('express');
const axios = require('axios'); 
const ejs = require('ejs'); 

const app = express();
const port = 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});
app.post('/weather', async (req, res) => {
    const city = req.body.city; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url); 
        const weatherData = response.data; 
        const weather = {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon
        };
        res.render('index', { weather: weather, error: null });

    } catch (error) {
        let errorMessage = 'Gagal mendapatkan data cuaca. Silakan coba lagi.';
        if (error.response && error.response.status === 404) {
            errorMessage = 'Kota tidak ditemukan. Mohon periksa ejaan.';
        } else {
            console.error('Error fetching weather data:', error.message);
        }
        res.render('index', { weather: null, error: errorMessage });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
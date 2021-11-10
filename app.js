const express = require('express');
const app =  express();
const morgan = require('morgan');
const geoip = require('geoip-lite');
const port = process.env.PORT || 3000

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req,res) => {
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    res.send('<a href="/direction" class="button">Info direction</a>');
    console.log(ip)

})

app.get('/direction', (req,res) => {
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    console.log(ip) 
    let geo = geoip.lookup(ip);
    console.log(geo);
    res.send(`<a href="/" class="button">Back</a><br><br> \
    Ip:${ip} \
    Country:${geo.country}); \
    Region:${geo.region}); \
    Timezone:${geo.timezone}); \
    Info:${geo.city}`); 
})

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
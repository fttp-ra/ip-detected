const express = require('express');
const app =  express();
const morgan = require('morgan');
const geoip = require('geoip-lite');
let fs = require('fs')
let fileJson = './ip-serch.json'
const port = process.env.PORT || 3000

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/*', (req,res) => {
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
    <br>Ip:${ip} \
    <br>Country:${geo.country} \
    <br>Region:${geo.region} \
    <br>Timezone:${geo.timezone} \
    <br>City:${geo.city}`);
    if(!fs.exists(fileJson)){
        fs.writeFileSync('ip-search.json', JSON.stringify(geo))
    }else{
        console.log('The file exist.')
    }
})

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
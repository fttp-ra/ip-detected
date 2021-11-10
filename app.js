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
    res.send('Hello world');
    console.log(ip) 
    let geo = geoip.lookup(ip);
    console.log(geo);
})

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
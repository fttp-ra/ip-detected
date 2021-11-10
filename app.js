const express = require('express');
const app =  express();
const morgan = require('morgan');
const geoip = require('geoip-lite');
let fs = require('fs');
const port = process.env.PORT || 3000
const redis = require('redis');
const portRedis = process.env.PORT || 6379
/* let redisHost = "redis-19884.c91.us-east-1-3.ec2.cloud.redislabs.com:19884"
let clientRedis = redis.createClient(portRedis, redisHost) */
const config = require('./config.json');
let accountSid = config.TWILIO_ACCOUNT_SID;
let authToken = config.TWILIO_AUTH_TOKEN;
const moment = require('moment');
const clientTwilio = require('twilio')(accountSid, authToken);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));



/* clientRedis.on('connect', function(err){
    if(err) return console.log(err.message);

    return console.log('Connected Redist');
}) */

app.get('/', (req,res) => {
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    res.send('<a href="/direction" class="button">Info direction</a>');
    console.log(ip)

})

app.get('/direction', (req,res) => {
    res.send('Received parameters');
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    //console.log(ip) 
    let geo = geoip.lookup(ip);
    let date = moment().format('LLL')
    //console.log(geo);
    try {
        if(fs.existsSync('log.txt')){
            console.log('File exist');
            fs.appendFile('log.txt',`\nip->${ip}`, (err) => {
                if(err) throw err.message;

                console.log('The ip is register in the new file');
            }) 
        }else{
            let logger = fs.createWriteStream('log.txt')
            console.log('File created');
            logger.write(`\nip->${ip}`); //date:date});
        }

    } catch (err) {
        console.log(err.message);
    }
})

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
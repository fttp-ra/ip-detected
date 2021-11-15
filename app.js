const express = require('express');
const app =  express();
const morgan = require('morgan');
const geoip = require('geoip-lite');
let fs = require('fs');
const ipfilter = require('express-ipfilter').IpFilter;
const port = process.env.PORT || 3000
const redis = require('redis');/* 
const portRedis = process.env.PORT || 6379
let redisHost = "redis-19884.c91.us-east-1-3.ec2.cloud.redislabs.com:19884"
let clientRedis = redis.createClient(portRedis, redisHost) */
const moment = require('moment');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


/* clientRedis.on('connect', function(err){
    if(err) return console.log(err.message);

    return console.log('Connected Redist');
}) */

let blackList = []

let callBlackList = () => {
    //let regExpIp = /^(\d{3}.\d{3}.\d{3}.\d{2}|\d{3}.\d{3}.\d{3}.\d{3}|\d{3}.\d{2}.\d{3}.\d{3})/g
    try {
        if(fs.existsSync('log.json')){
            let data = fs.readFileSync('log.json', 'utf-8')
            //console.log('The file log exist.',data);
            let arrayData = data.split(',');

             for(let x = arrayData.length - 1; x >= 0; x--){
                if(arrayData[x] === ''){
                    continue
                }else{
                    let ip = arrayData[x]
                    //console.log(ip);
                    blackList.push(ip)
                }
                app.use(ipfilter(blackList, {mode: 'deny'}))
            }
            //console.log(blackList);
            
        }else{
            console.log('The file blacklist for block IP, is not activate');
        }
    } catch (err) {
        console.log(err.message);
    }
}

callBlackList();

app.get('/', (req,res) => {
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    res.send('<a href="/direction" class="button">Info direction</a>');
    //console.log(ip)

})

app.get('/direction', (req,res) => {
    callBlackList()
    let ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    console.log(ip)
    let date = moment().format('LLL')
    //console.log(geo);
    try {
        if(fs.existsSync('log.txt')){
            console.log('File exist');
            fs.appendFile('log.json',`${ip},`, (err) => {
                if(err) throw err.message;
                console.log('The ip is register in the new file');
                res.send(`Received parameters <p>${ip}</p><br>`);
                console.log(blackList);
            }) 
        }else{
            let logger = fs.createWriteStream('log.json')
            console.log('File created');
            console.log(`${date}`);
            res.send(`Received parameters <p>${ip}</p><br>`);
            logger.write(`${ip},`); //date:date});
            console.log(blackList);
        }
    } catch (err) {
        console.log(err.message);
    }
})



app.listen(port, () => console.log(`Server at http://localhost:${port}`));
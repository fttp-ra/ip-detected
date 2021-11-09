const express = require('express');
const app =  express();
const morgan = require('morgan');
const port = process.env.PORT || 3000

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req,res) => {
    res.send('Hello world');
})

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
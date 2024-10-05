const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const routes = require('./routes/router.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('src'));
app.use('/', routes);


app.listen(3005, () => {
    console.log('http://localhost:3005');
});
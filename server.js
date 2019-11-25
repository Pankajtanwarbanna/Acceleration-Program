var express  = require('express');
var app = express();
var morgan = require('morgan');             // middleware to log http requests
var port = process.env.PORT || 3500;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var apiRoutes = require('./app/routes/api')(router);
var adminApiRoutes = require('./app/routes/adminApi')(router);

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// diff. front end and backend routes
app.use('/api', apiRoutes, adminApiRoutes);

// connecting to mongo database
mongoose.connect('mongodb://admin:acceleration123@ds249717.mlab.com:49717/acceleration', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Successfully connected to database.');
    }
});

// index page
app.get('*', function (req,res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

// server listening on port
app.listen(port, function () {
    console.log('Server running on port ' + port);
});

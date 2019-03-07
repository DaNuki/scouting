BinaryServer = require('binaryjs')
    .BinaryServer;
video = require('./lib/video/video');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname == 'gameVideo') {
            callback(null, video.uploadPath);
        }
    },

    filename: function (req, file, callback) {
        var id = req.body.gameid;
        if (file.fieldname == 'gameVideo') {
            callback(null, id + ".mp4");
        }
    }
});
var upload = multer({
        storage: storage
    })
    .fields([{
        name: 'gameVideo',
        maxCount: 1
    }]);



var games = require('./routes/games');
var users = require('./routes/users');
var help = require('./routes/help');
var game = require('./routes/game');
var event = require('./routes/event');
var teamcomparison = require('./routes/teamcomparison')
var teamgamedata = require('./routes/teamGameData');
var uploadRouter = require('./routes/upload');
var setup = require('./lib/elasticsearch/setup');
// setup.setup();
setTimeout(setup.setup, 5*1000);
setTimeout(setup.setup, 10*1000);
setTimeout(setup.setup, 20*1000);
setTimeout(setup.setup, 30*1000);
setTimeout(setup.setup, 40*1000);
setTimeout(setup.setup, 50*1000);
setTimeout(setup.setup, 60*1000);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());


app.use('/', game);
app.use('/users', users);
app.use('/upload', uploadRouter.router);
app.use('/games', games);
app.use('/game', game);
app.use('/event', event);
app.use('/teamgamedata', teamgamedata);
app.use('/teamcomparison', teamcomparison);

// TODO: compare teams that wil play with and against you
// TODO: find the best team to choose at playoffs
app.post('/upload', upload, uploadRouter.handleUpload);

// Lower priority than routes
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

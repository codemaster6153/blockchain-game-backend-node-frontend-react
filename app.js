let config = require('config');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let appRouter = require('./routes/app');
let gameRouter = require('./routes/game');
let clashdomeGameRouter = require('./routes/clashdome-game');
let mazeRouter = require('./routes/maze-game');
let avatarsRouter = require('./routes/avatars');
let statsRouter = require('./routes/stats');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes here
app.use('/api/app', appRouter);
app.use('/api/game', gameRouter);
app.use('/api/avatars', avatarsRouter);
app.use('/api/clashdome-game', clashdomeGameRouter);
app.use('/api/maze-game', mazeRouter);
app.use('/api/stats', statsRouter);

// client
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

console.log(config.get('port'));
console.log(`app environment: ${app.get('env')}`);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

require("./routes/stake-cpu").startJob();

process.on('uncaughtException', (err, origin) => {
  console.log("NEW CRITICAL ERROR!");
  console.log(err);
});

module.exports = app;
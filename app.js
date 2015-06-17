var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// YO: MÓDULO EXPRESS-PARTIALS (es un middleware, que soporta vistas parciales)
// .... para introducir un marco (layout.ejs) comun a todas las vistas
// ===============================================================================
var partials = require('express-partials');

// YO: LAS RUTAS (FISICAS)
// =============================================
// .... ruta de acceso a la página de entrada
var routes = require('./routes/index');
// =============================================

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// YO: Usar el módulo express-partials:
// ===============================================
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// YO: EL APP.USE ... DE LAS RUTAS
// =============================================
app.use('/', routes);		// YO: ASOCIA EL /routes/index CON LA RUTA /
// =============================================


// YO: RUTAS INDEFINIDAS (por ejemplo: localhost:3000/xxx
// =========================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// YO: SI SE ESTA EN "MODO DESARROLLO" APARECE EL STACK DEL ERROR POR PANTALLA
// =============================================================================
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

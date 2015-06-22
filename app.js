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

var methodOverride = require('method-override');

// MIDDELWARE DE GESTIÓN DE SESIONES:
var session = require('express-session');

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
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());


// YO: PARA UTILIZAR EL MIDDELWARE GESTIÓN DE SESIONES (express-session)
app.use(cookieParser('Quiz 2015'));
app.use(session());
//app.use(session({secret:'keyboard cat', key:'sid', cookie:{secure:true}}));


// MIDDLEWARE EJERCICIO DEL MODULO 9
// ========================================================================
app.use(function(req, res, next){
	
	// Si existe sesion:
	if (req.session.user){
		// Crear la variable de sesion horaUltOper en caso de que no exista
		// En caso de que exista ... controlar si ha tardado mas de 2 tiempo desde la ultima conexion
		//		... en este supuesto --> destruir la sesion
		if (req.session.horaUltOper){			
			// La función getTime() ... devuelve milisegundos
			var horaActual = new Date().getTime();
			var diferencia = horaActual - req.session.horaUltOper;
			// ... ver si han transcurrido mas de 2 MINUTOS:
			if (diferencia > (1000*60*2)){
				// Destruir las variables de sesion:
				delete req.session.user;
				delete req.session.horaUltOper;
			}else{
				// Almacenar la nueva hora:
				req.session.horaUltOper = horaActual;				
			}
		}else{
			req.session.horaUltOper = new Date().getTime();
		}		
	}
	next();

});




// ---------------------------------------------------------
// YO: SE INSTALA EL MW method-override.
//		El parámetro '_method' indica el nombre utilizado para encapsular el método!!!
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));






// ESTE MIDDLEWARE (asociado con las SESIONES) realiza dos funciones:
//		-- copia la sesion que esta accesible en req.session en res.locals.session
//				para que estén accesibles para las vistas
//		-- guarda la ruta de cada solicitud HTTP en la variable session.redir
//				para poder redireccionar a la vista anterior después de hacer login o logout
// ========================================================================

app.use(function(req, res, next){
	// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)){
		//console.log('**** PATH ANTERIOR: ' + req.session.redir);
		req.session.redir = req.path;
		//console.log('**** PATH GUARDADO: ' + req.session.redir);
	}
	
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

// ========================================================================


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
            error: err,
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: []
    });
});


module.exports = app;

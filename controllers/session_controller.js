// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if (req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
};

// Get /login	-- FORMULARIO DE LOGIN
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};
	console.log('***Dentro del formulario de login, anterior: ' + req.session.redir);
	res.render('sessions/new', {errors: errors});
};


// Post /login	-- CREAR LA SESION
exports.create = function(req, res){
		var login = req.body.login;
		var password = req.body.password;
		
		var userController = require('./user_controller');
		
		userController.autenticar(login, password, function(error, user){
			if (error) {	// Si hay error retornamos mensajes de errro de sesion
				req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
				res.redirect("/login");
				return;
			}
			
			// Crear req.session.user y guardar campos id y username
			// La sesion se define por la existencia de: req.session.user
			req.session.user = {id:user.id, username:user.username};
			
			// Redireccion a path anterior a login
			//res.redirect(req.session.redir.toString());
			//res.redirect('/');
			res.redirect(req.session.redir);
		});
};

// Delete /logout	-- DESTRUIR LA SESION
exports.destroy = function(req, res){
	delete req.session.user;
	// Redirigir a path anterior a login
	res.redirect(req.session.redir.toString());
	//res.redirect(req.session.redir);
};
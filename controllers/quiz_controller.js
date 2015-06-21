// SE INDICA QUE ESTAMOS TRABAJANDO CON EL MODELO (models.js)
var models = require('../models/models.js');

// ===========================================================
// Autoload - factoriza el código si ruta incluye :quizId
// ===========================================================
exports.load = function(req, res, next, quizId){
		// El parámetro .... where: {id: Number(quizId)}
		//							... para buscar el quiz identificado por quizId
		// El parámetro ... include: [{ model: models.Comment }]
		//							... solicita cargar en la propiedad quiz.Comments,
		//							los comentarios asociados a través de la relación 1 - N
	models.Quiz.find({
						where: {id: Number(quizId) },
						include: [{ model: models.Comment }]
					}).then(
		function(quiz) {
			if (quiz){
				req.quiz = quiz;
				next();
			}else{ next(new Error('No existe quizId='+quizId)); }
		}
	).catch(function(error){next(error);});
};
// -------------------------------------------------------------


// GET /quizes
exports.index = function(req,res){
	
	if (req.query.search !== undefined){
		
		// En el filtroBusqueda:
		//		+ Se ha concatenado al principio y al final el caracter '%' para el like
		//		+ Se han reemplazado los espacios en blanco de la cadena de búsquedas por el carácter '%'
		//				--> expresión regular:	\s	: para espacios en blanco
		//				-->						\s+	: puede ser más de un espacio en blanco
		//				-->						/g	: reemplazar todos!!
				
		var filtroBusqueda = "%" + req.query.search.replace(/\s+/g,'%') + "%";
		models.Quiz.findAll({where: ["pregunta like ?", filtroBusqueda], order: 'pregunta'}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});
		});
	}else{
		// No existe el parámetro "search": mostrar todas las preguntas (quizes) ... añadido el order (para que aparezcan también ordenadas)
		models.Quiz.findAll({order: 'pregunta'}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});
		});
	}
};

	//if ((req.query.respuestaUsuario.toUpperCase() === "CRISTOBAL COLON")

// GET /quizes/:id
exports.show = function(req, res){
	
	// AHORA ESTÁ FACTORIZADO POR EL exports.load !!!!
	// .... que busca previamente si existe el quizId
	// .... en caso contrario ya redirige hacia error
	res.render('quizes/show', {quiz: req.quiz, errors: []});
	
	// models.Quiz.findAll()	o 	find()
	//		---> se buscan datos en la tabla Quiz
		
	// Ahora se cambia findAll() .... por find(req.params.quizId)
	//		--> para que encuentre una pregunta en particular:
	/*models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz});
	})*/
	
	//  Con findAll() --> se busca el array de elementos de la tabla Quiz
	//	como solo tiene una pregunta en la tabla: se coge ... quiz[0]
	/*models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	})*/
	
	//	PREGUNTA DIRECTA: res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){	
	
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
	
	/*models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto' });
		}else{
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto' });
		}
	})*/


	/*models.Quiz.findAll().success(function(quiz){
		if (req.query.respuesta === quiz[;0].respuesta){
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	})*/
	
	/*if (req.query.respuesta === 'Roma'){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	}else{
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}*/
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(	// crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	// Se crea un objeto quiz a partir de los datos que vienen de la peticion (en el body):
	var quiz = models.Quiz.build(req.body.quiz);
	
	//console.log("Crear pregunta: " + req.body.quiz.pregunta + " y su respuesta es " + req.body.quiz.respuesta);
	
	
			
	// Se valida (en funcion de lo que marque el modelo):
	// ======================================================================
	// OJO IMPORTANTE: las versiones actuales NO SOPORTAN: ..validate().then
	//		... como indica el curso (hay que modificarlo)
	// ======================================================================
	var errors = quiz.validate(); // porque el objeto errors no tiene then
	if (errors){
		var i=0;
		var errores = new Array(); // se convierte en [] con la propiedad 
						// message por compatibilidad con el layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/new', {quiz: quiz, errors: errores});
	}else{
		quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
				res.redirect('/quizes');
		});
	}
	
	// NO FUNCIONA CON LA VERSIÓN ACTUAL:
	// ======================================
	/*quiz.validate().then(function(err){
		if (err) {
			//console.log("++++ Detectado error de validacion");
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else{
			//console.log("+++ NO Detectado error de validacion");
			// Guarda en la BD los campos pregunta y respuesta de quiz:
			//	(almacena el objeto no persistente quiz -solo las propiedades "pregunta" y "respuesta")
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
				res.redirect('/quizes');
			})
				// Redireccion HTTP (URL relativo) al Listado de Preguntas
				// La primitiva HTTP POST /quizes/create no tiene vista asociada
				//		+ Al terminar --> se realiza una redirección
		}
	});
	*/
	
		
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz
	
	res.render('quizes/edit', {quiz: quiz, errors: []});
};
	
	
// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
		
	var errors = req.quiz.validate(); // porque el objeto errors no tiene "then"
	if (errors){
		var i=0;
		var errores = new Array(); // se convierte en [] con la propiedad 
						// message por compatibilidad con el layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	}else{
	// save: guarda campos pregunta y respuesta en DB
		req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
			res.redirect('/quizes');
		});
	}
};
	
// NO FUNCIONA CON LA VERSIÓN ACTUAL: EL OBJETO ERRORS NO TIENE "THEN"
/*
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate().then(function(err){
		if (err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}else{
			// save: guarda campos pregunta y respuesta en DB
			req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
				res.redirect('/quizes');
			});
		}
	});
}
*/


// DELETE /quizes/:id
exports.destroy = function(req, res){
	// El método destroy() ordena la destruccion de la entrada de la tabla
	// identificada por req.quiz
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};


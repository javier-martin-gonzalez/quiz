// SE INDICA QUE ESTAMOS TRABAJANDO CON EL MODELO (models.js)
var models = require('../models/models.js');

// ===========================================================
// Autoload - factoriza el código si ruta incluye :quizId
// ===========================================================
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
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
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index', {quizes: quizes});
	});
};



// GET /quizes/:id
exports.show = function(req, res){
	
	// AHORA ESTÁ FACTORIZADO POR EL exports.load !!!!
	// .... que busca previamente si existe el quizId
	// .... en caso contrario ya redirige hacia error
	res.render('quizes/show', {quiz: req.quiz});
	
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
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
	
	/*models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto' });
		}else{
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto' });
		}
	})*/


	/*models.Quiz.findAll().success(function(quiz){
		if (req.query.respuesta === quiz[0].respuesta){
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
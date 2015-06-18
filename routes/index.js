// YO: ASOCIADO CON LA RUTA "/"
// =============================================

var express = require('express');
var router = express.Router();

// YO: SE INCLUYE EL CONTROLADOR
// =====================================
var quizController = require('../controllers/quiz_controller');

// PAGINA DE ENTRADA (home page)
// ===========================================
router.get('/', function(req, res) {
	// YO: con res.render --> se invoca a la VIEW (views/index.ejs)
	// 	res.render --> se generan y envian al cliente la Vista EJS
	//		y se le pasa como parámetro "title" con el valor Express
	// =============================================================
	// YO: esta ruta genera directamente la VIEW sin pasar por el CONTROLLER
  res.render('index', { title: 'Quiz', errors: []});
});

// AUTOLOAD de comandos con :quizId
//		quizController.load() se instala para que se ejecute antes
//			que lo necesiten las rutas show y answer, y solo en el
//			caso de que path contenga :quizId!!!!
//		Se instala con el método param de express ...
//			para que solo se invoque si existe el parametro :quizId
//			en algún lugar de la cabecera HTTP (en query, body o param)
// ==================================================================
router.param('quizId', quizController.load); // autoload :quizId


// YO: AHORA, DEFINICIÓN DE RUTAS DE /quizes
// ============================================
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
// Para dar de alta nuevas preguntas:
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);
// Para editar - modificar preguntas:
router.get('/quizes/:quizId(\\d+)/edit',	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			quizController.update);
// Para borrar preguntas:
router.delete('/quizes/:quizId(\\d+)',		quizController.destroy);


// YO: RUTA /quizes/question	--> se llama al Controller: quizController.question
//router.get('/quizes/question', quizController.question);

// YO: RUTA /quizes/answer	--> se llama al Controller: quiz_controller.answer
//router.get('/quizes/answer', quizController.answer);




// YO: RUTA /author --> invoca directamente a la View: views/author.ejs
router.get('/author', function(req, res){
	res.render('author', {errors: []});
});

module.exports = router;

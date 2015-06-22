// YO: ASOCIADO CON LA RUTA "/"
// =============================================

var express = require('express');
var router = express.Router();

// YO: SE INCLUYEN LOS CONTROLADORES
// =====================================
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

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

// OTRO AUTOLOAD para :commentId
//		... se ejecuta en caso de que path contenga :commentId
// ==================================================================
router.param('commentId', commentController.load);


// YO: DEFINICIÓN DE RUTAS DE SESION
// ============================================
router.get('/login',	sessionController.new);		//formulario login
router.post('/login',	sessionController.create);	// crear sesión
router.get('/logout',	sessionController.destroy);	// destruir sesion

// YO: DEFINICIÓN DE RUTAS DE /quizes
// ============================================
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
// Para dar de alta nuevas preguntas:
// ... una ruta puede invocarse con varios MWs en serie: MW1, MW2, ..
// 			se ejecutan en serie, de forma que si MW1 no pasa control
//			a MW2 con next() no llegará a ejecutarse
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create',				sessionController.loginRequired, quizController.create);
// Para editar - modificar preguntas:
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired, quizController.update);
// Para borrar preguntas:
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.destroy);

// Ver Estadísticas
router.get('/quizes/statistics',			statisticsController.index);

// YO: DEFINICIÓN DE RUTAS DE COMENTARIOS
// ============================================
router.get('/comments',								commentController.index);
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);

// ... el comentario estará accesible cuando la accion publish se ejecute:
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);


// YO: RUTA /quizes/question	--> se llama al Controller: quizController.question
//router.get('/quizes/question', quizController.question);

// YO: RUTA /quizes/answer	--> se llama al Controller: quiz_controller.answer
//router.get('/quizes/answer', quizController.answer);




// YO: RUTA /author --> invoca directamente a la View: views/author.ejs
router.get('/author', function(req, res){
	res.render('author', {errors: []});
});

module.exports = router;

// YO: ASOCIADO CON LA RUTA "/"
// =============================================

var express = require('express');
var router = express.Router();

// YO: SE INCLUYE EL CONTROLADOR
// =====================================
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
	// YO: con res.render --> se invoca a la VIEW (views/index.ejs)
	// 	res.render --> se generan y envian al cliente la Vista EJS
	//		y se le pasa como par�metro "title" con el valor Express
	// =============================================================
	// YO: esta ruta genera directamente la VIEW sin pasar por el CONTROLLER
  res.render('index', { title: 'Quiz' });
});

// YO: RUTA /quizes/question	--> se llama al Controller: quizController.question
router.get('/quizes/question', quizController.question);

// YO: RUTA /quizes/answer	--> se llama al Controller: quiz_controller.answer
router.get('/quizes/answer', quizController.answer);


module.exports = router;
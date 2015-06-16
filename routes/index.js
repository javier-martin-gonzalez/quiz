// YO: ASOCIADO CON LA RUTA "/"
// =============================================

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	// YO: con res.render --> se invoca a la VIEW (views/index.ejs)
	// 	res.render --> se generan y envian al cliente la Vista EJS
	//		y se le pasa como par�metro "title" con el valor Express
	// =============================================================
  res.render('index', { title: 'Quiz' });
});

module.exports = router;

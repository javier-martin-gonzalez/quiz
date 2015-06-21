// SE INDICA QUE ESTAMOS TRABAJANDO CON EL MODELO (models.js)
var models = require('../models/models.js');

// Autoload :id de comentarios
// ================================================
exports.load = function(req, res, next, commentId){
	models.Comment.find({ where: { id: Number(commentId) } }).then(function(comment){
		if (comment){
			req.comment = comment;
			next();
		} else {next(new Error('No existe commentId=' + commentId))}
	}).catch(function(error){next(error)});
				
};


// ================================================
// GET /comments
exports.index = function(req,res){

		models.Comment.findAll().then(function(comments){
			res.render('comments/index', {comments: comments, errors: []});
		});
};
// ================================================

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new', {quizid: req.params.quizId, errors: []});
};


// POST /quizes/:quizId/comments
exports.create = function(req, res){	
	console.log('creando comentario: ' + req.body.comment.texto + ' de la pregunta: ' + req.params.quizId);
	var comment = models.Comment.build(
							{ 	texto: req.body.comment.texto,
								QuizId: req.params.quizId
							});

	var errors = comment.validate(); // porque el objeto errors no tiene then
	if (errors){
		var i=0;
		var errores = new Array(); // se convierte en [] con la propiedad 
						// message por compatibilidad con el layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('comments/new', {comment: comment, quizid: req.params.quizId, errors: errores});
	}else{
		comment.save().then(function(){
				console.log('+++ Sin errores al dar de alta');
				res.redirect('/quizes/'+req.params.quizId);
				// Redireccion HTTP a Listas de Preguntas
		});
	}
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;
	req.comment.save({fields: ["publicado"]})
		.then( function(){ res.redirect('/quizes/'+req.params.quizId);})
		.catch(function(error){next(error)});
};


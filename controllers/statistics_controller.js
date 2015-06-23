// SE INDICA QUE ESTAMOS TRABAJANDO CON EL MODELO (models.js)
var models = require('../models/models.js');


// GET /quizes/statistics

exports.index = function(req,res){	
	// Extraer la información solicitada de la base de datos
	// para pasársela a la vista:
	
	var statistics = {numPreg: '', numCom: '', numMedioComXPreg: '', numPregSinCom: '', numPregConCom: ''}; 
	
	
	if (req.session.user){
		// Obtener el numero de preguntas:
		models.sequelize.query('select count(*) n from "Quizzes"').then(function(consulta) {
			
			statistics.numPreg = consulta[0].n;

			// Obtener el numero de comentarios totales:
			models.sequelize.query('select count(*) n from "Comments"').then(function(consulta) {
				statistics.numCom = consulta[0].n;
				
				// Obtener el numero medio de comentarios por pregunta	
				statistics.numMedioComXPreg = statistics.numCom / statistics.numPreg;
				
				// Obtener el numero de preguntas sin comentarios
				models.sequelize.query('select count(*) n from "Quizzes" where "id" not in (select distinct Q."id" from "Quizzes" Q  join "Comments" C on (Q."id" = C."QuizId"))').then(function(consulta) {
					statistics.numPregSinCom = consulta[0].n;
					
					// Obtener el numero de preguntas con comentarios
					models.sequelize.query('select count(*) n from "Quizzes" where "id" in (select distinct Q."id" from "Quizzes" Q join "Comments" C on (Q."id" = C."QuizId"))').then(function(consulta) {
						statistics.numPregConCom = consulta[0].n;
						
						res.render('statistics/index', {statistics: statistics, errors: []});
					});	
				});			
			});
						
		});
	}else{
		// Obtener el numero de preguntas:
		models.sequelize.query('select count(*) n from "Quizzes"').then(function(consulta) {
			
			statistics.numPreg = consulta[0].n;

			// Obtener el numero de comentarios PUBLICADOS:
			models.sequelize.query('select count(*) n from "Comments" where (publicado)').then(function(consulta) {
				statistics.numCom = consulta[0].n;
				
				// Obtener el numero medio de comentarios PUBLICADOS por pregunta	
				statistics.numMedioComXPreg = statistics.numCom / statistics.numPreg;
				
				// Obtener el numero de preguntas sin comentarios PUBLICADOS
				models.sequelize.query('select count(*) n from "Quizzes" where "id" not in (select distinct Q."id" from "Quizzes" Q  join "Comments" C on (Q."id" = C."QuizId") where (publicado))').then(function(consulta) {
					statistics.numPregSinCom = consulta[0].n;
					
					// Obtener el numero de preguntas con comentarios PUBLICADOS
					models.sequelize.query('select count(*) n from "Quizzes" where "id" in (select distinct Q."id" from "Quizzes" Q join "Comments" C on (Q."id" = C."QuizId") where (publicado))').then(function(consulta) {
						statistics.numPregConCom = consulta[0].n;
						
						res.render('statistics/index', {statistics: statistics, errors: []});
					});	
				});			
			});
						
		});
	}
};

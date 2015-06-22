// SE INDICA QUE ESTAMOS TRABAJANDO CON EL MODELO (models.js)
var models = require('../models/models.js');


// GET /quizes/statistics
exports.index = function(req,res){
	
	
	
	// Extraer la información solicitada de la base de datos
	// para pasársela a la vista:
	var estadisticas = {numPreg: '', numCom: '', numMedioComXPreg: '', numPregSinCom: '', numPregConCom: ''}; 
	


		// Obtener el numero de preguntas:
		models.sequelize.query('select count(*) numPreg from "Quizzes"').then(function(consulta) {
			estadisticas.numPreg = consulta[0].numPreg;
			
			// Obtener el numero de comentarios totales:
			models.sequelize.query('select count(*) numCom from "Comments"').then(function(consulta) {
				estadisticas.numCom = consulta[0].numCom;
				
				// Obtener el numero medio de comentarios por pregunta	
				estadisticas.numMedioComXPreg = estadisticas.numCom / estadisticas.numPreg;
				
				// Obtener el numero de preguntas sin comentarios
				models.sequelize.query('select count(*) numPregSinCom from "Quizzes" where "id" not in (select distinct Q."id" from "Quizzes" Q  join "Comments" C on (Q."id" = C."QuizId"))').then(function(consulta) {
					estadisticas.numPregSinCom = consulta[0].numPregSinCom;
					
					// Obtener el numero de preguntas con comentarios
					models.sequelize.query('select count(*) numPregConCom from "Quizzes" where "id" in (select distinct Q."id" from "Quizzes" Q join "Comments" C on (Q."id" = C."QuizId"))').then(function(consulta) {
						estadisticas.numPregConCom = consulta[0].numPregConCom;
						
						res.render('statistics/index', {estadisticas: estadisticas, errors: []});
					});	
				});			
			});	
		});
};
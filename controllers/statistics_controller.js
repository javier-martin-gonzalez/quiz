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


/*
exports.index = function(req, res){
         var statistics={ n_preguntas: ' -- ',
              n_comentarios: ' -- ',
                  promedio_comentarios: ' -- ',
                  preg_sin_com: ' -- ',
                  preg_con_com: ' -- ',
                 comentarios_no_pub: '--'
                };

    models.sequelize.query('SELECT count(*) AS n FROM "Quizzes"').then(function(cuenta) {//nº de preguntas
        statistics.n_preguntas=cuenta[0].n;
		
        models.sequelize.query('SELECT count(*) AS n FROM "Comments"').then(function(cuenta) {//nº de comentarios
		
		
            statistics.n_comentarios=cuenta[0].n;
			
            if(+statistics.n_preguntas>0) statistics.promedio_comentarios=cuenta[0].n/statistics.n_preguntas;//si es 0 el número de preguntas no está definido
			
			
            models.sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")').then(function(cuenta) {//nº de preguntas con comentario
                statistics.preg_con_com=cuenta[0].n;
                statistics.preg_sin_com=+statistics.n_preguntas-cuenta[0].n;
                models.sequelize.query('SELECT count(*) AS n FROM "Comments" WHERE NOT "publicado"').then(function(cuenta) {//nº de comentarios no publicados
                    statistics.comentarios_no_pub=cuenta[0].n;
                    res.render('statistics/index.ejs', {statistics: statistics, errors: []});
                });
            });
        });
      });

};
*/
// Definicion del modelo de Quiz
//	+ Se define la estructura de la tabla de quizes (preguntas)
//		---> 2 campos PREGUNTA y RESPUESTA (los dos de tipo string)
module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
					{ pregunta: DataTypes.STRING,
					  respuesta: DataTypes.STRING
					});
}
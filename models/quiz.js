// Definicion del modelo de Quiz CON VALIDACION

//	+ Se define la estructura de la tabla de quizes (preguntas)
//		---> 2 campos PREGUNTA y RESPUESTA (los dos de tipo string)
module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
		{ 
			pregunta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta Pregunta"}}
			},
			respuesta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta Respuesta"}}
			}
		});
}
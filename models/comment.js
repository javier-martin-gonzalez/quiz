// Definicion del modelo de COMMENT CON VALIDACION

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Comment',
		{ 
			texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta Comentario"}}
			}
		});
}
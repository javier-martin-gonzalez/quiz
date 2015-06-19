var path = require('path');

// POSTGRES		DATABASE_URL = postgres://user:passwd@host:port/database
// SQLITE		DATABASE_URL = sqlite://:@:/
// ======================================================================
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DB_name 	=   (url[6]||null);
var user		=	(url[2]||null);
var pwd			=	(url[3]||null);
var protocol	=	(url[1]||null);
var dialect		=	(url[1]||null);
var port		=	(url[5]||null);
var host		=	(url[4]||null);
var storage		=	process.env.DATABASE_STORAGE;
// ======================================================================

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// ======================================================================

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ 	dialect: 	protocol,
		protocol: 	protocol,
		port:		port,
		host:		host,
		storage:	storage,	// solo SQlite (.env)
		omitNull:	true		// solo Postgres
	}				
);


// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz;	// exportar la definición de tabla Quiz

// sequelize.sync() --> crea e inicializa tabla de preguntas en DB
//	CREA AUTOMÁTICAMENTE EL FICHERO quiz.sqlite !!!! (en caso de que la BD no exista)
sequelize.sync().then(function(){
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0){	// la tabla se inicializa solo si está vacía
		
			// Quiz.create ... añadiendo mas preguntas para probar el "order by" al buscar
			Quiz.create({ 	pregunta: 'Capital de Italia',
							respuesta: 'Roma',
							tema: 'Otro'
						});
			Quiz.create({ 	pregunta: 'Capital de Francia',
							respuesta: 'Paris',
							tema: 'Otro'
						});					
			Quiz.create({ 	pregunta: 'Inventor de la Penicilina',
							respuesta: 'Alexander Fleming',
							tema: 'Ciencia'
						});					
			Quiz.create({ 	pregunta: 'Inventor de la Radio',
							respuesta: 'Guillermo Marconi',
							tema: 'Ciencia'
						});						
			Quiz.create({ 	pregunta: 'Autor de la República',
							respuesta: 'Platon',
							tema: 'Humanidades'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});
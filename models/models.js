var path = require('path');

//hago esto para poder ejecutar npm start
//cargo la variable auxiliar con variables de entorno si ejecuto foreman o la inicializo si ejecuto npm start, si ejecuto
//npm start , DATABASE_URL es vacio
var auxUrl = process.env.DATABASE_URL;
var auxStorage = process.env.DATABASE_STORAGE;
if(!auxUrl) auxUrl="sqlite://:@:/";
if(!auxStorage) auxStorage="quiz.sqlite";

var url = auxUrl.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6] || null);
var user 	= (url[2]||null);
var pwd 	= (url[3]||null);
var protocol= (url[1]||null);
var dialect	= (url[1]||null);
var port	= (url[5]||null);
var host	= (url[4]||null);
var storage	= auxStorage;

//Cargar modelo ORM
var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name, user, pwd,
	{	dialect:	protocol,
		protocol:	protocol,
		port:		port,
		host:		host,
		storage: 	storage,
		omiNull:	true
	}
);



//usar BBDD SQlite:
var sequelize = new Sequelize(null,null,null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
						);
						
//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exportar definición de tabla quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count===0){ //la tabla se inicializa solo si está vacia
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema: 'otro'
						  });
			Quiz.create({ pregunta: 'Capital de Spain',
						  respuesta: 'Madrid',
						  tema: 'otro'
						  });				
			Quiz.create({ pregunta: 'Capital de Francia',
						  respuesta: 'Paris',
						  tema: 'otro'
						  });						  
			Quiz.create({	pregunta: 'Capital de portugal',
							respuesta:	'Lisboa',
							tema: 'otro'
						})			  
			.then(function(){console.log('base de datos inicializada')});	
		};
	});
});						
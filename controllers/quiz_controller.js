var models = require('../models/models.js');

//Autoload 
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error) { next(error);});	
};


exports.show = function(req, res){
	//models.Quiz.find(req.params.quizId).then(function(quiz){
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
};


exports.answer = function (req, res){
	var resultado = 'incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};
/*	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', 
				{ quiz: quiz,	respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer',
				{ quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
*/	

//Get /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( //crea objeto quiz 
	{pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//Post /quizes/Create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	quiz.validate().then(
	function(err){
		if (err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else {
			quiz //Save
			.save({fields: ["pregunta", "respuesta","tema"]})
			.then( function(){ res.redirect('/quizes')})
		}
	}
	);
	
	/*
	//guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		
	}) //redirección http (url relativo) lista de preguntas
*/
	};


exports.index= function(req, res){
	// y aquí el odigo de búsqueda
	var inputValueSearch = (req.query.search || "texto_a_buscar");
	var search = '%';
	
	if(req.query.search) {
			search=search+req.query.search+'%';
			search=search.replace(/\s+/g,'%');
	}
	models.Quiz.findAll(
		{	where: ["lower(pregunta) like lower(?)",search],
			order: 'pregunta ASC'
		}	
	).then(function(quizes){
		res.render('quizes/index',{quizes: quizes, search: inputValueSearch, errors: []});
	}).catch(function(error){next(error);});
};
	
//Get quizes/:id/edit
exports.edit = function(req, res){
	var quiz= req.quiz; //autoload
	res.render('quizes/edit', {quiz: quiz, errors: []});
};	
	
/*	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', { quizes: quizes});
			}).catch(function(error) { next(error);})
	};
*/	

//put /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else{
			req.quiz//Save guarda campos pregunta y respuesta en DB
			.save( {fields: ["pregunta", "respuesta","tema"]})	
			.then( function(){ res.redirect('/quizes');});
			}
		}
	);
	
};

//Defenicionde rutas de /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(Error)});
};
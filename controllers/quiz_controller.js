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
	res.render('quizes/show', { quiz: req.quiz});
};


exports.answer = function (req, res){
	var resultado = 'incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
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
		res.render('quizes/index',{quizes: quizes, search: inputValueSearch});
	}).catch(function(error){next(error);});
};
	
	
/*	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', { quizes: quizes});
			}).catch(function(error) { next(error);})
	};
*/	

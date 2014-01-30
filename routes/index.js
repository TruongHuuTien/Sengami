
/*
 * GET home page.
 */
var app = {
	title	: "Sengami",
	version	: "0.0.3"	
};

exports.index = function(req, res){
  res.render('index', { title: app.title, version: app.version });
};
exports.home = function(req, res){
  res.render('home', { title: app.title, version: app.version });
};

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Sengami', version: "0.0.3" });
};
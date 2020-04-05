module.exports = function (frontRouter) {

frontRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.post('/user', function(req, res, next){
  res.json({ success: true });
});
}

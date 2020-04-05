module.exports = function (apiRouter, qh) {

apiRouter
.get('/', function(req, res, next) {
  res.json({ success: true });
})
.get('/users', function(req, res, next) {
  res.json({ success: true });
})
.post('/users', qh, function(req, res, next){
  if(req.body.callback){
    res.redirect(req.body.callback);
  }else{
    res.json({ success: true });
  }
});
}

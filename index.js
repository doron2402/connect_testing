var connect = require('connect')
  , http = require('http');

var form = '\n\
  <form action="/" method="post">\n\
    <input type="hidden" name="_csrf" value="{token}" />\n\
    <input type="text" name="user[name]" value="{user}" placeholder="Username" />\n\
    <input type="password" name="user[pass]" value="{pass}" />\n\
    <input type="submit" value="Login" />\n\
  </form>\n\
'; 

var app = connect()
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'keyboard cat' }))
  .use(connect.bodyParser())
  .use(connect.csrf())
  .use(function(req, res, next){
    if ('POST' != req.method) return next();
    req.session.user = req.body.user;
    next();
  })
  .use(function(req, res){
  	console.log(req);
  	if (req.body && req.body.user && req.body.user.name && req.body.user.pass){
  		
  		//Now validate
  		if (req.body.user.name === 'admin' && req.body.user.pass === 'admin'){
  			var body = '<h1>Whatup, ' + req.body.user.name + '</h1>';
  		}else{
  			var body = '<h1>WRONG PASSWORD</h1>';
  		}
  		
  		res.setHeader('Content-Type', 'text/html');
  		res.end(body);
  	}else{
  		res.setHeader('Content-Type', 'text/html');
	    var body = form
	      .replace('{token}', req.csrfToken())
	      .replace('{pass}', req.session.user && req.session.user.pass || '')
	      .replace('{user}', req.session.user && req.session.user.name || '');
	    res.end(body);
  	}
    
  });

http.createServer(app).listen(3000);
console.log('Server listening on port 3000');
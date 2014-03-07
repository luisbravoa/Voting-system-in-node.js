var restify = require('restify');

var config = require('./config.js');

var server = restify.createServer();

var backbone = require('backbone');

global.backbone = backbone;

require('./models/index.js');

var Issue = require('./models/Issue.js');


server.name = "Erasys trial task!";
server.port = 3000;

// Include routes
var Issues = require('./routes/issues.js');

server.use(restify.bodyParser({ mapParams: false }));

// Just in case! if we want this API to be consumed in other domains
var enableCORS = function crossOrigin(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length');
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
}


server.use(enableCORS);


// initialize DB, in our case we we'll not persist data so i am only going to declair a variable

global.data = {
    issues: {}
};

server.listen(config.server.port, config.server.ip, function(err){
    if(!err) console.log('api running ' + config.server.ip + ':' + config.server.port);
});


// Issues routes
server.get('/issues/list',Issues.list);
server.post('/issues/vote',Issues.vote);

server.get('/issues/:id',Issues.find);
server.post('/issues',Issues.add);


var express = require("express");
var app = express();
var path = require('path');

app.use(express.logger());

app.configure(function() {
  app.use('/js', express.static(path.join(__dirname, 'static/js')));
  app.use('/css', express.static(path.join(__dirname, 'static/css')));
});

app.get('/', function(request, response) {
    response.sendfile('static/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

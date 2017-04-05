/**
 * Created by richard on 05/02/2017.
 */
var express = require('express'),
  proxy = require('express-http-proxy'),
  liveload = require('connect-livereload'),
  url = require('url'),
  path = require('path');

var PROXY_PATHS = ['/svc'];
var proxyAddr = 'localhost:8080';

var server = express();
var appDir = path.join(__dirname, './build/app');
var nodeModulesDir = path.join(__dirname, './node_modules');

server.set('title','i2037');
server.use('/node_modules', express.static(nodeModulesDir));
server.use('/', express.static(appDir));
server.use(liveload({
  port: 35729
}));

PROXY_PATHS.forEach(function (path) {
  server.use(path, proxy(proxyAddr, {
    forwardPath: function(req, rsp) {
      var proxyPath = '/i2037-webapp' + path + url.parse(req.url).path;
      console.log("proxyPath: " + proxyPath);
      return proxyPath;
    }
  }))
});

server.use('/j_spring_security_check', proxy(proxyAddr, {
  forwardPath: function(req, rsp) {
    var proxyPath = '/i2037-webapp/j_spring_security_check';
    console.log("proxyPath: " + proxyPath);
    return proxyPath;
  }
}));

// server.get('/', function (req, res) {
//     res.sendFile("index.html", {"root": appDir});
// });

var port = process.env.PORT || 9070;

server.listen(port, function () {
  console.log('Express server listening on port ' + port);
});
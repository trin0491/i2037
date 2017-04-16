/**
 * Created by richard on 05/02/2017.
 */
var express = require('express'),
  proxy = require('express-http-proxy'),
  liveload = require('connect-livereload'),
  url = require('url'),
  morgan = require('morgan'),
  path = require('path');

const PROXY_PATHS = ['/i2037-webapp/svc', '/i2037-webapp/j_spring_security_check', '/i2037-webapp/j_spring_security_logout'];
const PROXY_ADDR = 'localhost:8080';
const PORT = process.env.PORT || 9070;

var app = express();
var appDir = path.join(__dirname, './build/app');
var nodeModulesDir = path.join(__dirname, './node_modules');
var logger = morgan('combined');

app.set('title','i2037');
app.use('/i2037-webapp/node_modules', express.static(nodeModulesDir));
app.use('/i2037-webapp', express.static(appDir));
app.use(liveload({
  port: 35729
}));
app.use(logger);

PROXY_PATHS.forEach(function (proxyPath) {
  app.use(proxyPath, proxy(PROXY_ADDR, {
    forwardPath: function(req, rsp) {
      var path = url.parse(req.url).path;
      if (path.length > 1) {
        return proxyPath + path;
      } else {
        return proxyPath;
      }
    },
    intercept: function(rsp, data, req, res, callback) {
      if (rsp.statusCode === 302) {
        var redirect = url.parse(res.getHeader('location'));
        res.setHeader('location', "http://localhost:" + PORT + redirect.path);
      }
      callback(null, data);
    }
  }))
});

app.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
});
/**
javascript - Cómo configurar rutas dinámicas con express.js

Tengo un route.js que se ve así:
*/


module.exports = function(app) {

  app.get('/tip', function(req, res) {
    res.render("tip");
  });

  app.get('/article', function(req, res) {
   res.render("article");
  });

  app.get('/article1', function(req, res) {
   res.render("article1");
  });

  app.get('/article2', function(req, res) {
   res.render("article2");
  });

  app.get('/article3', function(req, res) {
   res.render("article3");
  });

  app.get('/modules/:name', function(req, res) {
    var name = req.params.name;
    res.render('modules/' + name);
  });

  app.get('/modules/esaver/:name', function(req, res) {
    var name = req.params.name;
    res.render('modules/esaver/' + name);
  });

};
/*
Teniendo en cuenta que tengo más de 200 rutas diferentes para crear, terminaría con cosas como 'article1', 'article2', etc.

y mi app.js es como:*/

var express = require('express')
  ,http = require('http')
  ,fs = require('fs')
  ,path = require('path');

var app = express();

html_templates = __dirname + '/html_templates';

app.set('views', html_templates + '/views');
app.set('view engine', 'jade');

app.use('/Core', express.static(__dirname + '/Core'));


app.listen(3000, function () {
 console.log("express has started on port 3000");
});

require('./html_templates/controller/routes.js')(app);


/*
Finalmente lo hice funcionar ...

En los casos en que obtuve, artículo1, artículo2, etc.*/

app.get('/:name(article|article2|article3)?', function(req, res) {
    var name = req.params.name;
    res.render(name);
});
En los casos en que obtuve url de múltiples niveles, creé una función personalizada:

function geturl(url) {

  app.get('/' + url + '/' + ':name', function(req, res){
    var name = req.params.name;
    res.render(url + '/' + name);
  });

};


/*
Hay muchas formas de implementar rutas dinámicas express. Depende
 en gran medida de la estructura que hayas implementado en tu proyecto, 
 aquí te dejo un ejemplo de rutas dinámicas y espero que te sea útil.

RouterService.js
*/

module.exports = (function(myCustomRoutes) {
   let express = require('express');
   let router  = express.Router();
   let methods = Object.keys(myCustomRoutes); // getting methods ('get', 'post'... etc)
   let routesMethod = null;
   let url = null;

   for(i in methods) {
      routesMethod = Object.keys(myCustomRoutes[methods[i]]);
      for(j in routesMethod) {
         url = '/' + routesMethod[j];
         url += '/:' + myCustomRoutes[methods[i]][routesMethod[j]].params.join('/:');console.log(url);
         router[methods[i]](url, myCustomRoutes[methods[i]][routesMethod[j]].controller);
      }
   }

   return router;
})();


/*CustomRoutes.js*/

module.exports = (function() {
    let routes = {get: {}, post: {}};
    let routerService = require('./RouterService');

    // GET:  /dynamic1
    routes.get.dynamic1 = {
       params: [],
       controller: function(req, res, next) {
           res.send('route 1');
       }
    };

    // GET:  /dynamic2/:param1
    routes.get.dynamic2 = {
       params: [':param1'],
       controller: function(req, res, next) {
           res.send('route 2');
       }
    };
    // POST: /dynamic3/:param1/:param1
    routes.post.dynamic3 = {
       params: ['param1', 'param2'],
       controller: function(req, res, next) {
          res.send('route 3');
       }
    };

    /*
    *  Export a router with paths
    *  GET:  /dynamic1
    *  GET:  /dynamic2/:param1
    *  POST: /dynamic3/:param1/:param1
    **/
    return routerService(routes);
})();



/*app.js*/
let express = require('express');
let app = express();


/*
 *  Option 1
 *  GET:  /dynamic1
 *  GET:  /dynamic2/:param1
 *  POST: /dynamic3/:param1/:param1
 **/
 app.use(require('CustomRoutes')());


/*
 *  Option 2
 *  GET:  /api/v1/dynamic1
 *  GET:  /api/v1/dynamic2/:param1
 *  POST: /api/v1/dynamic3/:param1/:param1
 **/
 app.use('/api/v1', require('CustomRoutes')());

const express = require('express');
const minifyHTML = require('express-minify-html');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const compression = require('compression');
const routesCentral = require('./routes/routes');
// const helmet = require('helmet');
const Youch = require('youch');

// add version on static files
const staticify = require('staticify')(path.join(__dirname, '..', 'public'));
const period = 60 * (60 * 24); // 24 horas

class App {
  constructor() {
    this.express = express();

    this.middleware();
    this.view();
    this.routes();
  }

  middleware() {
    this.express.disable('x-powered-by');
    this.express.set(express.urlencoded({ extended: false }));
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use(cookieParser());
    this.express.use(compression());

    // max age for static files
    this.express.use(function (req, res, next) {
      req.url = req.url.replace(
        /\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/,
        '/$1.$2'
      );
      next();
    });

    this.express.use(staticify.middleware);

    this.express.locals = {
      getVersionedPath: staticify.getVersionedPath,
    };

    this.express.use(
      minifyHTML({
        override: true,
        exception_url: false,
        htmlMinifier: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          minifyJS: true,
        },
      })
    );

    // this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
  
    this.express.use(
      express.static(path.join(__dirname, '..', 'public'), {
        maxAge: period,
        etag: true,
        setHeaders: function (res, path, stat) {
          res.set({
            'x-timestamp': Date.now(),
            'Cache-control': `public, max-age=${period}`
          })
        }
      })
    );

    this.express.use(function (req, res, next) {
      res.setHeader(
        "Permissions-Policy",
        'geolocation=(self "https://www.youtube.com/"), fullscreen=(self "https://www.youtube.com/"), autoplay=("https://www.youtube.com/"), encrypted-media=("https://www.youtube.com/"), gyroscope=("https://www.youtube.com/"), web-share=("https://www.youtube.com/"), accelerometer=("https://www.youtube.com/"), payment=(self), picture-in-picture=(self "https://www.youtube.com/")'
      );
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', '*');
      res.set('Access-Control-Allow-Credentials', true);
      res.set('Access-Control-Max-Age', '600'); //10 minutes

      return next();
    });
  }

  view() {
    this.express.set(
      'views',
      path.join(__dirname, '..', 'src', 'views')
    );
    this.express.set('view engine', 'ejs');
  }

  routes() {
    this.express = routesCentral.generateRoutes(this.express);

    // catch 404 and forward to error handler
    this.express.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.express.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const youch = new Youch(err, req);
        return youch
          .toHTML()
          .then((html) =>
            res.status(500).set('Content-Type', 'text/html').send(html)
          );
      }

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      var location = {};
      location.state = 'BR';
      location.city = '';
      location.cityView = 'Brasil';

      if (err.status === 400) {
        res.status(err.status || 500);
        res.render('error', {
          title: 'Ofertas Imperdíveis - 0km, SUVs e Utilitários',
          objs: {},
          stateCitySelected: location,
          objsBanner: {},
        });
      } else {
        res.status(err.status || 500);
      }
    });
  }
}

module.exports = new App().express;

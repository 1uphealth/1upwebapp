require('dotenv').config();
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const auth = require('./auth');
const oneup = require('./oneup');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

app
  .prepare()
  .then(() => {
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(
      cookieSession({
        name: 'demoappsession',
        keys: ['Woof', 'Meow', 'Cluck'], // you should change these
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      }),
    );

    server.use(auth.passwordless.sessionSupport());
    server.use(
      auth.passwordless.acceptToken({ successRedirect: '/dashboard' }),
    );

    server.post(
      '/sendtoken',
      auth.passwordless.requestToken((email, delivery, fn) => fn(null, email)),
      (req, res) => res.json('ok'),
    );

    server.get('/callback', auth.authUser, (req, res) => {
      res.redirect('/dashboard');
    });

    server.get('/dashboard', auth.authUser, (req, res) => {
      app.render(req, res, '/dashboard', req.params);
    });

    // we suggest bundling your requests to the 1uphealth api on the backend
    // and presenting them to the frontend via your own api routes
    server.get('/api/dashboard', auth.authUser, (req, res) => {
      var oneupAccessToken =
        req.session.oneup_access_token ||
        req.headers.authorization.split(' ')[1];
      oneup.getAllFhirResourceBundles(oneupAccessToken, function(responseData) {
        res.send({ token: oneupAccessToken, resources: responseData });
      });
    });

    server.get('/logout', (req, res) => {
      req.session = null;
      res.redirect('/login');
    });

    server.post('/logout', (req, res) => {
      req.session = null;
      req.user = null;
      res.json('ok');
    });

    server.get('/', auth.authUser, (req, res) => {
      app.render(req, res, '/index', req.params);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

module.exports = server;

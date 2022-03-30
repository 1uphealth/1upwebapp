const passwordless = require('passwordless');
const MemoryStore = require('passwordless-memorystore');
const email = require('emailjs');
const oneup = require('./oneup.js');

const smtpServer = email.server.connect(process.env.EMAIL_SERVER);

passwordless.init(new MemoryStore(), { skipForceSessionSave: true });
passwordless.addDelivery((token, uid, recipient, callback) => {
  console.log('recipient', recipient);
  oneup.getOrMakeOneUpUserId(recipient, function (oneupUserId) {});
  smtpServer.send(
    {
      text: `Welcome to the 1upHealth Demo! Click this link to login \n\n\n\n${process.env.BASE_URL}/?token=${token}&uid=${uid} \n\n`,
      attachment: {
        data: `Welcome to the 1upHealth Demo Click <a href="${process.env.BASE_URL}/?token=${token}&uid=${uid}">this link</a> to login`,
        alternative: true,
      },
      from: process.env.EMAIL_SENDER,
      to: recipient,
      subject: '1upHealth demo login token',
    },
    function (err, message) {
      if (err) {
        console.log(`could not send email, here's the token url`);
        console.log(
          '\ntoken url',
          `${process.env.BASE_URL}/?token=${token}&uid=${uid}\n`,
        );
      }
    },
  );
});

function authUser(req, res, next) {
  if (
    (typeof req.session !== 'undefined' &&
      Object.keys(req.session).length > 0 &&
      typeof req.session.passwordless !== 'undefined') ||
    typeof req.headers.authorization != 'undefined'
  ) {
    req.session.oneup_access_token =
      oneup.accessTokenCache[req.session.passwordless];
    if (typeof req.session.oneup_access_token === 'undefined') {
      if (typeof req.headers.authorization === 'undefined') {
        res.redirect('/login');
      } else {
        req.session.oneup_access_token =
          req.headers.authorization.split(' ')[1];
        next();
      }
    } else {
      next();
    }
  } else {
    res.redirect('/login');
  }
}

exports.passwordless = passwordless;
exports.authUser = authUser;

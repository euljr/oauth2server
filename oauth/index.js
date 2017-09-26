
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const {
    OAuthClientModel
} = require('../model/OAuth');

const oauth = new OAuth2Server({
    debug: true,
    model: require('./model')
});

const extendedGrantTypes = {
    email: require('./email_grant')
};

module.exports = {
    oauth,
    authorize: (options) => {
        var options = options || {};
        return function (req, res, next) {
            var request = new Request({
                headers: { authorization: req.headers.authorization },
                method: req.method,
                query: req.query,
                body: req.body
            });
            var response = new Response(res);

            oauth.authenticate(request, response, options)
                .then(token => {
                    req.user = token;
                    next();
                })
                .catch(err => next(err));
        }
    },
    configure: function (app) {
        app.all('/oauth/token', function (req, res, next) {
            var request = new Request(req);
            var response = new Response(res);
            oauth
                .token(request, response, {extendedGrantTypes})
                .then(data => res.json({
                    success: true,
                    data
                }))
                .catch(next);
        });
        // TO-DO: EP's de authorization (API's para serviços externos, caso necessário)
    }
}
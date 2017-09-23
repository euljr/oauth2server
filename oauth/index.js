
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const {
    User,
    OAuthAccessToken,
    OAuthClient,
    OAuthAuthorizationCode,
    OAuthRefreshToken,
    OAuthScope
} = require('./repository');

const oauth = new OAuth2Server({
    debug: true,
    model: require('./model')
});

module.exports = {
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
                .then(function (token) {
                    // Request is authorized.
                    req.user = token
                    next()
                })
                .catch(function (err) {
                    // Request is not authorized.
                    res.status(err.code || 500).json(err)
                });
        }
    },
    configure: function (app) {
        app.all('/oauth/token', function (req, res, next) {
            var request = new Request(req);
            var response = new Response(res);

            oauth
                .token(request, response)
                .then(function (token) {
                    // Todo: remove unnecessary values in response
                    return res.json(token)
                }).catch(function (err) {
                    return res.status(500).json(err)
                })
        });

        app.post('/authorize', function (req, res) {
            var request = new Request(req);
            var response = new Response(res);

            return oauth.authorize(request, response).then(function (success) {
                res.json(success)
            }).catch(function (err) {
                res.status(err.code || 500).json(err)
            })
        });

        app.get('/authorize', function (req, res) {
            return OAuthClient
                .where({
                    client_id: req.query.client_id,
                    redirect_uri: req.query.redirect_uri,
                })
                .fetch()
                .then(function (model) {
                    if (!model) return res.status(404).json({ error: 'Invalid Client' });
                    return res.json(model);
                }).catch(function (err) {
                    return res.status(err.code || 500).json(err)
                });
        });
    }
}
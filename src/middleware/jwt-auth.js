const AuthService = require("../endpoint_auth/auth-service");

const JwtService = {
    requireAuth(req, res, next) {
        // Pull out AuthToken from Authorization header of client's request to the protected endpoint
        const AuthToken = req.get('Authorization') || '';
        //console.log(AuthToken);

        // check that format of auth/bearer token is correct
        if (!AuthToken.toLowerCase().startsWith('bearer ')) {
            return res
                .status(401)
                .json({
                    error: 'Missing bearer token.'
                })
        } else {
            // token is correctly formatted --> isolate actual token
            bearerToken = AuthToken.slice(7, AuthToken.length)
        }

        // Verify that user exists in DB
        try {
            const payload = AuthService.verifyJwt(bearerToken);

            AuthService.getUserWithUserEmail(
                req.app.get('db'),
                payload.sub,
            )
                .then(user => {
                    if (!user) {
                        return res
                            .status(401)
                            .json({
                                error: 'Unauthorized request - cannot find this user.'
                            })
                    }
                    // if user DOES exist, put user's info in req
                    req.user = user
                    next()
                })
                .catch(err => {
                    console.error(err)
                    next(err)
                })
        } catch(error) {
            res
                .status(401)
                .json({
                    error: 'Unauthorized request - trying failed.'
                })
        }
    }
}

module.exports = JwtService;
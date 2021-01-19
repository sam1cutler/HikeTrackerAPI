const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {

    // Pull out AuthToken from Authorization header of client's request to the protected endpoint
    const AuthToken = req.get('Authorization') || '';
    
    // Instantiate empty bearerToken
    let bearerToken

    // check that format of auth/bearer token is appropriate
    if (!AuthToken.toLowerCase().startsWith('bearer ')) {
        return res
            .status(401)
            .json({
                error: 'Missing bearer token.'
            })
    } else {
        // if it's correct, pull out the token itself
        bearerToken = AuthToken.slice(7, AuthToken.length)
    }

    // Verify that this user exists in DB
    try {
        const payload = AuthService.verifyJwt(bearerToken)

        AuthService.getUserWithUserEmail(
            req.app.get('db'),
            payload.sub,
        )
            .then(user => {
                if (!user)
                    return res
                        .status(401)
                        .json({
                            error: 'Unauthorized request.'
                        })
                // If user exists, put that user's info in the request
                req.user = user;
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
                error: 'Unauthorized request.'
            })
    }
}

module.exports = {
    requireAuth,
}
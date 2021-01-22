const AuthService = require("../endpoint_auth/auth-service");

const JwtService = {
    requireAuth(req, res, next) {
        //console.log('You invoked requireAuth middleware.')
        //console.log(req)
        //console.log(res)
        
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
            //console.log('Token is correctly formatted.')
            // token is correctly formatted --> isolate actual token
            bearerToken = AuthToken.slice(7, AuthToken.length)
            //console.log(bearerToken)
        }

        // Verify that user exists in DB
        try {
            //console.log('Starting to try...')
            const payload = AuthService.verifyJwt(bearerToken);

            //console.log(`In jwt-auth.js and the payload is '${payload}'`)
            //console.log(`In jwt-auth.js and the payload.sub is '${payload.sub}'`)

            AuthService.getUserWithUserEmail(
                req.app.get('db'),
                payload.sub,
            )
                .then(user => {
                    //console.log('Back in jwt-auth, found the following user:')
                    //console.log(user)
                    if (!user) {
                        return res
                            .status(401)
                            .json({
                                error: 'Unauthorized request - cannot find this user.'
                            })
                    }
                    // if user DOES exist, put user's info in req
                    //console.log('User authenticated, appending user info to request and sending out of jwt-auth.js')
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
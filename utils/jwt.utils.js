var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'coucou'

module.exports = {
    generateTokenForUser: function (UserData) {
        return jwt.sign({
            userId: UserData.id
        },
            JWT_SIGN_SECRET, {
            expiresIn: '24h'
        })
    },
    

    getUserId: function (token) {
        var userId = -1;
        // var token = module.exports.parseAuthorization(authorization);
        console.log('le token dans la fonction est:'+ token);
        if (token != null) {
            try {
                try {
                    console.log(typeof(token));
                    var jwtToken = jwt.verify(token, JWT_SIGN_SECRET );
                    // console.log('ici'+ jwtToken.userId);
                }catch(error){
                    console.log(error);
                }
                
                if (jwtToken != null)
                    userId = jwtToken.userId;
            } catch (err) { }
        }
        return userId;
    }
}
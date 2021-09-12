var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'z14hbtegvr5f2cze'

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
        
        if (token != null) {
            try {
                try {
                    console.log(typeof(token));
                    var jwtToken = jwt.verify(token, JWT_SIGN_SECRET );
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
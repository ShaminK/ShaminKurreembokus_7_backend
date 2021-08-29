const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = JSON.parse(req.headers.authorization);
        console.log('le token est : ' + token);

        const decodedToken = jwt.verify(token, 'coucou');

        console.log(decodedToken.userId);
        const userId = decodedToken.userId;
        console.log('je suis ici :'+ userId);
        console.log(req.body);

        console.log('salut: '+ bla);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};
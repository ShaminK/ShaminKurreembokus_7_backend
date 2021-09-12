const jwt = require('jsonwebtoken');
const multer = require('multer');

// Ici on récupére le token dans le headers authorization de la requete
// Ensuite on verifie si il comporte un userId 
// Si il y a un userId on l'envoie dans la requete req.tokenUserId
// Puis le ctrl appelé verifira si req.tokenUserId = req.body.userId

module.exports = (req, res, next) => {
    try {
    
        const token = JSON.parse(req.headers.authorization);
        const decodedToken = jwt.verify(token, 'z14hbtegvr5f2cze');

        const userId = decodedToken.userId;
        
        req.tokenUserId = userId;
            next();
        }
     catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};
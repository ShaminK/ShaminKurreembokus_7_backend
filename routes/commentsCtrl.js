var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
const { listPost } = require('./postCtrl');

module.exports = {
    // creer un commentaire
    createComment: function (req, res) {
        
        console.log('(on est dans le commentCtrl)');
        const postId = parseInt(req.params.postId);

        console.log('(commentCtrl) le body de la req: '+ req.body);

        console.log('(commentCtrl) userid du token: '+ req.tokenUserId);
        console.log('(commentCtrl) postId du parametre est : '+ postId);
        // console.log('(commentCtrl) le commentaire est: '+ req.body.comment);
        // console.log('(commentCtrl) userId du body est: '+ req.body.userId);
        console.log(req.body.userId);
        const userId = req.body.userId

        if (postId <= 0) {
            console.log('cas 1');
            return res.status(400).json({ 'error': 'Le paramètre est invalide !' })
        }

        if(req.tokenUserId != req.body.userId) {
            console.log('cas 2');
            return res.status(403).json({'error': 'Accés non autorisé !'} )
        }

        if (req.body.comment == null) {
            console.log('cas 3');
            return res.status(400).json({ 'error': `Aucun commentaire` })
        }

        models.Post.findOne({
            where: { id: postId }
        })
            .then((postFound) => {
                models.User.findOne({
                    where: { id: userId }
                })
                    .then((userFound) => {
                        models.Comment.create({
                            postId: postId,
                            userId: userId,
                            comment: req.body.comment
                        })
                            .then((newComment) => {
                                res.status(201).json(newComment);
                            })
                            .catch((err) => {
                                res.status(500).json({ 'error': 'Impossible de créer un commentaire' })
                            })
                    })
                    .catch((err) => {
                        res.status(404).json({ 'error': 'Utilisateur introuvable !' })
                    })
            })
            .catch((err) => {
                res.status(404).json({ 'error': 'Le post est introuvable !' })
            })
    },

    // Recupérer la liste de commentaire d'un post
    listComment: function (req, res) {
        var postId = (req.params.postId);
        console.log('le post est : '+ postId);
        if (postId <= 0) {
            return res.status(400).json({ 'error': 'Le paramètre est invalide !' })
        }

        models.Comment.findAll({
            where: { postId: postId },
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]
        }).then((comments)=> {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(400).json({'error': 'comment no found'})
            }
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json({ "error": "warning" });
        })
    }
}
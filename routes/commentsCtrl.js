var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
const { listPost } = require('./postCtrl');

module.exports = {
    // creer un commentaire
    createComment: async function (req, res) {

        const postId = parseInt(req.params.postId);

        const userId = req.body.userId

        if (postId <= 0) {

            return res.status(400).json({ 'error': 'Le paramètre est invalide !' })
        }

        if (req.tokenUserId != req.body.userId) {

            return res.status(403).json({ 'error': 'Accés non autorisé !' })
        }

        if (req.body.comment == null) {

            return res.status(400).json({ 'error': `Aucun commentaire` })
        }
        
        try {
            const post = await models.Post.findOne({
            where: { id: postId }
        })
        } catch (error) {
            res.status(404).json({ 'error': 'Le post est introuvable !' })
        }
        
        try {
             let user = await models.User.findOne({
            where: { id: userId }
        })
        } catch (error) {
            res.status(404).json({ 'error': 'Utilisateur est introuvable !' })
        }
       

        try {
            let comment = await models.Comment.create({
            postId: postId,
            userId: userId,
            comment: req.body.comment
        })
        } catch (error) {
            console.log(error);
            res.status(500).json({ 'error': 'Impossible de créer un commentaire !' })
        }

        


        const commentWithUser = await models.Comment.findOne({
            where: { id: newComment.id },
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]

        })
        res.status(201).json(commentWithUser);

    },

    // Recupérer la liste de commentaire d'un post
    listComment: function (req, res) {
        var postId = (req.params.postId);
        if (postId <= 0) {
            return res.status(400).json({ 'error': 'Le paramètre est invalide !' })
        }

        models.Comment.findAll({
            where: { postId: postId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]
        }).then((comments) => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(400).json({ 'error': 'comment no found' })
            }
        })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ "error": "warning" });
            })
    }
}
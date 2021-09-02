var models = require('../models');
// var jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');


module.exports = {
    createPost: function (req, res) {
        console.log('(createPost)');
   
        // let userId = req.body.userId;

        console.log(req.body);
        console.log(req.file);
        // console.log(req.file.filename);
        console.log(req.tokenUserId);
        if(req.tokenUserId != req.body.userId) {
            return res.status(403).json({'error': 'Accés non autorisé !'} )
        }

        if (req.body.title == null || req.body.description == null) {
            return res.status(400).json({ 'error': 'Titre ou description manqant' });
        }
        models.User.findOne({
            where: { id: req.body.userId }
        })
            .then((userFound) => {
                console.log('user trouvé est : ' + userFound.id + ' nom: ' + userFound.lastname);
                models.Post.create({
                    title: req.body.title,
                    description: req.body.description,
                    // urlPost: 'empty',
                    urlPost: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    UserId: userFound.id
                })
                    .then((newPost) => {
                        res.status(201).json(newPost);
                    })
                    .catch((err) => {
                        res.status(500).json({ 'error': 'Impossible de créer de post' });
                    })
            })
            .catch((err) => {
                console.log(err);
                res.status(404).json({ 'error': 'Utilisateur introuvable!' })
            })
    },

    listPost: function (req, res) {
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);

        if (limit > 50) {
            limit = 50;
        }

        models.Post.findAll({
            order: [['createdAt', 'DESC']],
            attributes: null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]
        }).then((posts) => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ "error": "no posts found" });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
        })
    }
}
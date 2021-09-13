var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
const jwt = require('jsonwebtoken')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{8,15}$/;

module.exports = {

    // --------------------------------------------------------------------
    // Enregistrement d'utilisateur ---------------------------------------
    // --------------------------------------------------------------------

    signup: function (req, res) {
        var mail = req.body.mail;
        var password = req.body.password;
        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        console.log('(usersCtrl/signup) le mail est: ' + mail);
        console.log('(usersCtrl/signup) le pw est: ' + password);
        console.log('(usersCtrl/signup) le ln est: ' + lastname);
        console.log('(usersCtrl/signup) le fn est: ' + firstname);

        if (mail == null || password == null || lastname == null || firstname == null) {
            console.log('(usersCtrl/signup) cas 1');
            return res.status(400).json({ 'error': `Information(s) manquante(s)` })
        }

        if (lastname.length <= 1) {
            console.log('(usersCtrl/signup) cas 2');
            return res.status(400).json({ 'error': `Votre nom doit contenir plus d'une lettre` });
        }

        if (firstname.length <= 1) {
            console.log('(usersCtrl/signup) cas 3');
            return res.status(400).json({ 'error': `Votre prénom doit contenir plus d'une lettre` });
        }

        if (!EMAIL_REGEX.test(mail)) {
            console.log('(usersCtrl/signup) cas 4');
            return res.status(400).json({ 'error': `Entrez une adresse mail` });
        }

        if (!PASSWORD_REGEX.test(password)) {
            console.log('(usersCtrl/signup) cas 5');
            return res.status(400).json({ 'error': `Le mot de passe doit contenir entre 8 à 15 caractères et doit inclure aux moins 1 chiffre` })
        }

        console.log('(usersCtrl/signup) ');
        models.User.findOne({
            attributes: ['mail'],
            where: { mail }
        })
            .then((userFound) => {
                if (!userFound) {
                    bcrypt.hash(password, 10, function (err, bcryptedPassword) {
                        var newUser = models.User.create({
                            mail: mail,
                            password: bcryptedPassword,
                            lastname: lastname,
                            firstname: firstname
                        })
                            .then(newUser => {
                                return res.status(201).json({
                                    'userId': newUser.id
                                })
                            })
                    })
                } else {
                    return res.status(409).json({ 'error': 'L\'adresse mail existe déjà' })
                }
            })
            .catch(err => {
                return res.status(500).json({ 'error': 'impossible de verifier l\'existence de l\'adresse mail' })
            })
    },

    // -----------------------------------------------------------------------
    // Connexion d'utilisateur -----------------------------------------------
    // -----------------------------------------------------------------------


    login: function (req, res) {

        if (req.body.mail == null || req.body.password == null) {
            return res.status(400).json({ 'error': 'l\'adresse mail et/ou mot de passe manquant(s)' })
        }

        console.log('(usersCtrl/login) le corps de la requete contient: ' + req.body.mail + ' et ' + req.body.password);

        models.User.findOne({
            attributes: ['id', 'mail', 'password', 'lastname', 'firstname'],
            where: { mail: req.body.mail }
        })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' })
                }
                console.log('(usersCtrl/login) User trouvé : ' + user.firstname)
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: "Mot de passe incorrect !" })
                        }
                        return res.status(200).json({
                            'userId': user.id,
                            'lastname': user.lastname,
                            'firstname': user.firstname,
                            'token': jwt.sign(
                                { userId: user.id },
                                'coucou',
                                {expiresIn: '24h'}
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error: 'Probleme' }))
            })
            .catch(error => {
                res.status(500).json({ error: "Une erreur est survenue" })
                console.error(error);
            });
    },

    // -----------------------------------------------------------------------
    // Récupération d'utilisateur --------------------------------------------
    // -----------------------------------------------------------------------
    getUserProfile: function (req, res) {
        var token = req.headers.authorization.split(' ')[1];
        console.log('Ici' + token);
        var userId = jwtUtils.getUserId(token);

        console.log(userId);

        if (userId < 0)
            return res.status(400).json({ 'error': 'Mauvais token' });

        models.User.findOne({
            attributes: ['id', 'mail', 'lastname', 'firstname'],
            where: { id: userId }
        })
            .then(function (user) {
                if (user) {
                    res.status(201).json(user);
                } else {
                    res.status(404).json({ 'error': 'Utilisateur introuvable !' })
                }
            })
            .catch(function (err) {
                res.status(500).json({ 'error': 'Impossible de récupérer l\'utilisateur !' })
            })
    },

    // -----------------------------------------------------------------------
    // Suppréssion d'utilisateur ---------------------------------------------
    // -----------------------------------------------------------------------

    deleteUser: function (req, res) {
        console.log('(userCtrl/ delete) etape 1');
        // let userIdToken = req.tokenUserId
        // let userId = req.body.userId
        
        console.log('(userCtrl/ delete) user id du token est '+ req.tokenUserId);
        console.log('(userCtrl/ delete) user id du body est '+ req.body.userId);
        
        



        if (req.tokenUserId < 0){
            return res.status(400).json({ 'error': 'Mauvais token' });
        }

        console.log('(userCtrl/ delete)  etape 2');
            
        if (req.body.userId != req.tokenUserId) {
            return res.status(401).json({ 'error': 'Accés interdit' });
        }

        console.log('(userCtrl/ delete) etape 3');


        models.User.destroy({
            where: { id: req.body.userId }
        })
            .then((userRmove) => {
                res.status(200).json({ 'message': 'Le compte utlisateur a été supprimé' })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ 'error': 'Une erreur s\'est produite' })
            })


    }
}


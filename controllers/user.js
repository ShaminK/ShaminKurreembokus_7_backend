const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var models = require('../models')

// const User = require('../models/User');

exports.signup = (req, res) => {
    console.log(req);
    return res.status(400).json({ 'error': `Information(s) manquante(s)` })
    // var mail = req.body.mail;
    // var password = req.body.password;
    // var lastname = req.body.lastname;
    // var firstname = req.body.firstname;
    // console.log('le mail est: ' + mail);
    // if (mail == null || password == null || lastname == null || firstname == null) {
    //     return res.status(400).json({ 'error': `Information(s) manquante(s)` })
    // }
    // models.User.findOne({
    //     attributes: ['mail'],
    //     where: { mail: mail }
    // })
    //     .then((userFound) => {
    //         if (!userFound) {
    //             bcrypt.hash(password, 10, function (err, bcryptedPassword) {
    //                 var newUser = models.User.create({
    //                     mail: mail,
    //                     password: bcryptedPassword,
    //                     lastname: lastname,
    //                     firstname: firstname
    //                 })
    //                     .then(newUser => {
    //                         return res.status(201).json({
    //                             'userId': newUser.id
    //                         })
    //                     })
    //             })
    //         } else {
    //             return res.status(409).json({ 'error': 'L\'adresse mail existe déjà' })
    //         }
    //     })
    //     .catch(err => {
    //         return res.status(500).json({ 'error': 'impossible de verifier l\'existence de l\'adresse mail' })
    //     })
}


exports.login = (req, res) => {

}
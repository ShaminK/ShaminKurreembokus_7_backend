var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var postCtrl = require('./routes/postCtrl');
var commentCtrl = require('./routes/commentsCtrl');
const multer = require('./middleware/multer-config');
const auth = require('./middleware/auth')

exports.router = (function() {
    var apiRouter = express.Router();

    // Routes Users -------------------------------------------------------------
    apiRouter.route('/auth/signup/').post(usersCtrl.signup);
    apiRouter.route('/auth/login/').post(usersCtrl.login);
    apiRouter.route('/auth/profile/').get(auth, usersCtrl.getUserProfile);
    apiRouter.route('/auth/delete/').delete(auth, usersCtrl.deleteUser);


    // Routes Post---------------------------------------------------------------
    apiRouter.route('/posts/edit/').post(auth, multer , postCtrl.createPost);
    apiRouter.route('/posts/').get(auth, postCtrl.listPost);

    // Routes Comments ----------------------------------------------------------
    apiRouter.route('/posts/:postId/comment/').post(auth, commentCtrl.createComment);
    apiRouter.route('/posts/:postId/listComment/').get(auth, commentCtrl.listComment);
    
    return apiRouter;
})();
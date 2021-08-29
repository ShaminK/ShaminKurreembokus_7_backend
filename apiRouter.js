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
    apiRouter.route('/auth/profile/').get(usersCtrl.getUserProfile);
    apiRouter.route('/auth/delete/').delete(usersCtrl.deleteUser);


    // Routes Post---------------------------------------------------------------
    apiRouter.route('/posts/edit/').post(auth, multer , postCtrl.createPost);
    apiRouter.route('/posts/').get(postCtrl.listPost);

    // Routes Comments ----------------------------------------------------------
    apiRouter.route('/posts/:postId/comment/').post(commentCtrl.createComment);
    apiRouter.route('/posts/:postId/listComment/').get(commentCtrl.listComment);
    
    return apiRouter;
})();
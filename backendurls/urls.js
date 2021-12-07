const  express =  require("express");

const router = express.Router();

const authenticateToken = require('../backendfunctions/authentication/authenticateToken');

const signupUser = require('../backendfunctions/authentication/signup');

const loginUser = require('../backendfunctions/authentication/login');

const addProducts = require('../backendfunctions/activities/addProducts');

const viewProducts = require('../backendfunctions/activities/viewProducts');

const addToCart = require('../backendfunctions/activities/addToCart');

const webConfFunc = require('../backendfunctions/activities/webConf');

const authData = require('../backendfunctions/authentication/authData');

const viewCart = require('../backendfunctions/activities/viewCart');

const removeFromCart = require('../backendfunctions/activities/removeFromCart');

const addPost = require('../backendfunctions/activities/addPost');

const viewPosts = require('../backendfunctions/activities/viewPosts');

const viewPost = require('../backendfunctions/activities/viewPost');

const addComment = require('../backendfunctions/activities/addComment');

const viewComments = require('../backendfunctions/activities/viewComments');

router.post(`/api/signup`, signupUser);

router.post(`/api/login`, loginUser);

router.post(`/api/products/add`, addProducts);

router.post(`/api/post/add`, authenticateToken.authAccount, addPost);

router.post(`/api/cart/add`, authenticateToken.authAccount, addToCart);

router.post(`/api/cart/remove`, authenticateToken.authAccount, removeFromCart);

router.post('/api/post=:postId/comment/add', authenticateToken.authAccount, addComment);

router.get(`/api/webconf`, webConfFunc);

router.get(`/api/products/view`, viewProducts);

router.get('/api/authData', authData);

router.get('/api/cart', viewCart);

router.get('/api/posts/view', viewPosts);

router.get('/api/post', viewPost);

router.get('/api/post/:postId/comments/view', viewComments);

module.exports = router;

const express = require('express');
const router = express.Router();
const {USER_ROUTES} = require('../constants/routes.constants');
const {registerUser,loginUser,changePassword,resetPassword,updatePassword,logoutUser,googleAuth,googleAuthCallback,facebookAuth,facebookAuthCallback} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post(USER_ROUTES.REGISTER, registerUser);
router.post(USER_ROUTES.LOGIN, loginUser);
router.post(USER_ROUTES.CHANGE_PASSWORD, verifyToken, changePassword);
router.post(USER_ROUTES.RESET_PASSWORD, resetPassword);
router.post(USER_ROUTES.UPDATE_PASSWORD, updatePassword);
router.post(USER_ROUTES.LOGOUT, verifyToken, logoutUser);

router.get('/google',googleAuth);

router.get('/google/callback',googleAuthCallback);

router.get('/facebook',facebookAuth);

router.get('/facebook/callback',facebookAuthCallback);

module.exports = router;


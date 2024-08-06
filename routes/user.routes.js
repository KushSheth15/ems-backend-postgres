const express = require('express');
const router = express.Router();
const {USER_ROUTES} = require('../constants/routes.constants');
const {registerUser,loginUser,changePassword,resetPassword,updatePassword,logoutUser} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post(USER_ROUTES.REGISTER, registerUser);
router.post(USER_ROUTES.LOGIN, loginUser);
router.post(USER_ROUTES.CHANGE_PASSWORD, verifyToken, changePassword);
router.post(USER_ROUTES.RESET_PASSWORD, resetPassword);
router.post(USER_ROUTES.UPDATE_PASSWORD, updatePassword);
router.post(USER_ROUTES.LOGOUT, verifyToken, logoutUser);

module.exports = router;


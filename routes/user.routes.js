const express = require('express');
const router = express.Router();

const {registerUser,loginUser,changePassword,resetPassword,updatePassword,logoutUser} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post('/register', registerUser);

router.post('/login',loginUser);

router.post('/change-password',verifyToken,changePassword);

router.post('/reset-password',resetPassword);

router.post('/update-password',updatePassword);

router.post('/logout',verifyToken,logoutUser);

module.exports = router;


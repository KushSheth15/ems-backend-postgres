require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.User;

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id); // Fetch user from DB
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'photos'] // Specify which fields you want to retrieve
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value; 
        console.log('Facebook profile email:', email);

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({
                username: profile.displayName,
                email,
                password: null // No password needed for OAuth users
            });
        }

        // Generate access and refresh tokens
        const generatedAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '2h' }
        );
        const generatedRefreshToken = jwt.sign(
            { id: user.id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Update the user's refresh token in the database
        await user.update({
            token: generatedRefreshToken,
            tokenType: 'REFRESH',
            expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiration
        });

        done(null, {
            user,
            accessToken: generatedAccessToken,
            refreshToken: generatedRefreshToken
        });
    } catch (error) {
        console.error('Error during Facebook authentication:', error);
        done(error, null);
    }
}));

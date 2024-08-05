const db = require("../models/index");
const User = db.User;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await User.create({ username, email, password });

        res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error occurred when creating user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        };

        const accessToken = jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        await User.update({
            token: refreshToken,
            tokenType: 'REFRESH',
            expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
            {
                where: { id: user.id }
            }
        );

        res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
}

// const logoutUser = async (req, res) => {
//     try {
//         const userId  = req.user.id;

//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // if (user.token !== token) {
//         //     return res.status(400).json({ message: 'Invalid token' });
//         // }

//         await User.update(
//             {
//                 token: null,
//                 tokenType: null,
//                 expireAt: null
//             },
//             {
//                 where: { id: userId }
//             }
//         );

//         res.status(200).json({ message: 'Logged out successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while logging out' });
//     }
// };

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({ message: "All fields are required" });
        };

        const userId = req.user.id;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match' });
        }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        res.status(200).json({ message: 'Password changes successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while changing the password' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(401).json({ message: "Email is required" });
        };

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const resetToken = jwt.sign({id:user.id},ACCESS_TOKEN_SECRET,{expiresIn:'1h'});

        

        await User.update({token:resetToken,tokenType:'RESET'},{where:{id:user.id}});
        res.status(200).json({message:'Reset token generated successfully',resetToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating reset token' });
    }
}

const updatePassword = async (req,res)=>{
    try {
        const {email,resetToken,newPassword} = req.body;

        const decoded  = jwt.verify(resetToken,ACCESS_TOKEN_SECRET);

        const user = await User.findOne({where:{email,token:resetToken,tokenType:'RESET'}});
        if(!user){
            return res.status(404).json({ message: 'Invalid email or reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
            {
                password: hashedPassword,
            },
            { where: { id: decoded.id } }
        );

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    changePassword,
    resetPassword,
    updatePassword
    // logoutUser
}
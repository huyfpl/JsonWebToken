const User = require('../models/user');
const bcrypt = require('bcrypt'); // hash password
const jwt = require('jsonwebtoken'); // tạo token

// generate token
let refreshTokens = [];
const authController = {
    // register
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // create user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            // save user to the database
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error registering the user' });
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        }, process.env.JWT_ACCESS_KEY, { expiresIn: '20s' });
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        }, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' });
    },

    // login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            };
            // so sánh password nhập vào và password trong database
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Wrong password' })
            }
            if (user && validPassword) {
                // tạo accesstoken 
                const accesstoken = authController.generateAccessToken(user);
                // tạo refreshtoken
                const refreshtoken = authController.generateRefreshToken(user);
                // lưu refreshtoken vào mảng
                refreshTokens.push(refreshtoken);
                res.cookie('RefreshToken', refreshtoken, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    secure: false,
                });
                const { password, ...info } = user._doc;// lấy hết các trường trong user._doc trừ password
                res.status(200).json({ ...info, accesstoken });
            }
        } catch (error) {

        }
    },
    // tạo accesstoken mới từ refreshtoken
    refreshToken: async (req, res) => {
        const rf_token = req.cookies.RefreshToken;
         if (!rf_token)
            return res.status(401).json("Bạn chưa đăng nhập");
         if (!refreshTokens.includes(rf_token))
         // kiểm tra refreshtoken có trong mảng refreshTokens hay không     
        jwt.verify(rf_token, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
               console.log(err);
            }
              // xóa refreshtoken cũ trong mảng refreshTokens
             refreshTokens = refreshTokens.filter((token) => token !== rf_token);
           // tạo accesstoken mới và refreshtoken mới
             const newAccessToken = authController.generateAccessToken(user);
             const newRefreshToken = authController.generateRefreshToken(user);
             refreshTokens.push(newRefreshToken);// thêm refreshtoken mới vào mảng refreshTokens
            res.cookie('Newrefreshtoken', newRefreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
                secure: false,
            });
            res.status(200).json({accesstoken: newAccessToken});
        
        });
    },
    // logout
    logoutUser: async (req, res) => {
        res.clearCookie('RefreshToken');
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.RefreshToken);
        res.status(200).json("Đăng xuất thành công");
    },

};

module.exports = authController;

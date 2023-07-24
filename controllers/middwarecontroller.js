const jwt = require('jsonwebtoken');


const middwarecontroller = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            // ví dụ Bearer token
            const accessToken = token.split(" ")[1];// lấy token từ header và cắt bỏ phần Bearer
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token đã hết hạn hoặc không hợp lệ");
                }
                req.user = user;
                next();
            }
            );
        }
        else {
            res.status(401).json("Bạn chưa đăng nhập");
        }
    },
    verifyAdmin: (req, res, next) => {
        middwarecontroller.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin)
            // nếu id của user trong token trùng với id trong params hoặc user là admin thì cho phép truy cập
            {
                next();
            }
            else {
                res.status(403).json("Bạn không có quyền truy cập");
            }
        });
    }
};
module.exports = middwarecontroller;
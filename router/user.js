const userController = require('../controllers/usercontroller');
const middwarecontroller = require('../controllers/middwarecontroller');
const router = require('express').Router();

// get all users
router.get('/',middwarecontroller.verifyToken, userController.getAllUsers);
// sử dụng middwarecontroller.verifyToken để xác thực token trước khi thực hiện hành động tiếp theo
router.delete('/:id',middwarecontroller.verifyAdmin, userController.deleteUser);
module.exports = router;
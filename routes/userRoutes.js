const express = require("express")
const router = express.Router();
const { registeruser, login, forgotPassword, resetPassword }=require("../controllers/userController")

router.post('/register', registeruser)
router.post('/login', login)
router.post('/forgot', forgotPassword)
router.post('/reset', resetPassword)



module.exports = router;

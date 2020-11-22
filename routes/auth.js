const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout,
    requireSignin,
    verify,
    send
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.post("/verify", verify);
router.post("/send", send);

module.exports = router;

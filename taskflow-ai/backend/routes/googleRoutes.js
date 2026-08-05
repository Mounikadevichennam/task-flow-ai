const express = require("express");
const router = express.Router();

const {
  googleLogin,
  googleCallback,
} = require("../controllers/googleController");

router.get("/login", googleLogin);
router.get("/callback", googleCallback);

module.exports = router;
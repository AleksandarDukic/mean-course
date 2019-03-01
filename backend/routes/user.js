const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;


// instaliramo paket za hesovanje sifri: npm install --save bcryptjs (bcrypt nije hteo da prodje)
// importujemo ga na vrhu

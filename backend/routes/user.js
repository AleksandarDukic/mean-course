const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
        });
       user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {               // ovde hvatamo gresku ako imamo isti email koji je provalio moonguse-unque-validator
          res.status(500).json({
            error: err
          });
        });
    });

});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);   // rezultat compare funkcije je boolean PROMISE na koji se vezujemo then() blokom u sledecem redu
  })
  .then(result => {
    if (!result){
      return res.status(401).json({       // ovde mora return res jer nije poslednje moguce res u metodi
        message: "Auth failed"
      });
    }                           // vise o tokenima na jwt.io, npm install --save jsonwebtoken
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },     // jwt.sign() pravi token sa specifikacijiama zadatim u obliku json objekta zbog jedinstvenosti (payload)
      'secret_this_should_be_longer',            // drugi argument je "secret" i cuva se samo na serveru, sluzi za proveru
      { expiresIn: "1h" }                          // treci argument je javaScript objekat koji moze imati nekoliko vrednosti od kojih je jedna "Expires in"
    );
    console.log(token);
    res.status(200).json({                        // poslednji res u metodi pa ne mora return
      token: token,
      expiresIn: 3600                              // radi u seknudama
    })
  })
  .catch(err => {
    return res.status(401).json({
      message: "Auth failed"
    })
  })
})

module.exports = router;


// instaliramo paket za hesovanje sifri: npm install --save bcryptjs (bcrypt nije hteo da prodje)
// importujemo ga na vrhu

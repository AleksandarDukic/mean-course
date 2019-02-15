const jwt = require("jsonwebtoken");

module.exports = (req, res ,next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];       // mi smo izabrali da u dolazni poziv stavljamo token u header pod nazivom polja authorization
    jwt.verify(token, 'secret_this_should_be_longer');         // "Bearer token1231321sadljsakjd" split(" ")[1] znaci da uzimamo drugi deo niza koji je razdvojen " "
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" })
  }

}

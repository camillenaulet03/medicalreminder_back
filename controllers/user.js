const sql = require("../database/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")

User.create = async (req, res, next) => {
  const password = req.body.password;
  if (password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit au moins faire 8 caractères !"
    });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir des minuscules !"
    });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir des majuscules !"
    });
  }
  if (!/\d/.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir des chiffres !"
    });
  }
  if (!/[@$!%*?&.]/.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir des caractères spéciaux: @$!%*?&"
    });
  }
  const saltRounds = 10;
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  sql.query("SELECT * FROM user WHERE email = ?", [req.body.email.toLowerCase()], (selectErr, selectResult) => {
    if (selectErr) {
      console.log("error: ", selectErr);
      res.status(500).json({message: selectErr});
      return;
    }

    if (selectResult.length > 0) {
      res.status(400).json({message: "Duplicate email. User already exists."});
      return;
    }

    sql.query("INSERT INTO user SET ?", req.body, (insertErr, insertResult) => {
      if (insertErr) {
        console.log("error: ", insertErr);
        res.status(500).json({message: insertErr});
        return;
      }
      res.status(201).json({insertResult});
    });
  });
};

User.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  sql.query('SELECT * FROM user WHERE email = ?', [email.toLowerCase()], async (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(500).json({message: err});
      return;
    }

    if (!result) {
      return res.status(401).json({message: "Identifiants invalides !"});
    }

    if (result.length) {
      const passwordMatch = await bcrypt.compare(password, result[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Identifiants invalides !" });
      }
      const token = jwt.sign({userId: result[0].id}, process.env.JWT_KEY, {expiresIn: '24h'});
      const response = result[0];
      res.status(200).json({response, token: token});
      return;
    }

    res.status(500).json({kind: "not_found"});
  });
};

User.logout = (req, res, next) => {
  const email = req.body.email;

  sql.query(`SELECT * FROM user WHERE email = ?`,[email.toLowerCase()], (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(500).json({message: err});
      return;
    }

    if (result.length) {
      console.log("found user: ", result[0]);
      let token = req.header('authorization');
      token = token.replace('Bearer ', '');
      jwt.sign({token: token}, process.env.JWT_KEY, { expiresIn: 0 } , (err, logout) => {
        if (logout) res.status(200).json();
        res.status(500).json({ kind: "not_found" });
      });
      return;
    }

    res.status(500).json({ kind: "not_found" });
  });
};

module.exports = User;

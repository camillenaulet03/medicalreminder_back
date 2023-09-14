const sql = require("../database/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../mailer/config");
const User = require("../models/user");

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

    if (!req.body.phone.startsWith('+33')) {
      req.body.phone = req.body.phone.replace(/^./g, '+33');
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
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  sql.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
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
      const id = result[0].id;
      const phone = result[0].phone;
      const client = require('twilio')(process.env.SID, process.env.TOKEN);
      const verifySid = process.env.VAD;
      await client.verify.v2
        .services(verifySid)
        .verifications.create({to: phone, channel: "sms", locale: 'fr'})
        .then((verification) => {
          sql.query(
            "UPDATE user SET status = ? WHERE email = ?",
            [verification.status, email],
            (err, result) => {
              if (err) {
                console.log("error: ", err);
                res.status(500).json({message: err});
                return;
              }

              if (res.affectedRows == 0) {
                res.status(500).json({kind: "not_found"});
                return;
              }

              console.log("update status: ", {id: req.body.email.toLowerCase(), ...req.body});
              res.status(200).json({id});
            }
          )
        })
      return;
    }

    res.status(500).json({kind: "not_found"});
  });
};

User.verify = (req, res, next) => {
  sql.query('SELECT * FROM user WHERE id = ?', [req.body.id], async (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(500).json({message: err});
      return;
    }
    if (result.length) {
      const role = result[0].id_role;
      const token = jwt.sign({userId: result[0].id}, process.env.JWT_KEY, {expiresIn: '24h'});
      const client = require('twilio')(process.env.SID, process.env.TOKEN);
      const verifySid = process.env.VAD;
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({to: result[0].phone, code: req.body.code})
        .then((verification_check) => {
          sql.query(
            "UPDATE user SET status = ? WHERE id = ?",
            [verification_check.status, req.body.id],
            (err, user) => {
              if (err) {
                console.log("error: ", err);
                res.status(500).json({message: err});
                return;
              }

              if (res.affectedRows == 0) {
                res.status(500).json({kind: "not_found"});
                return;
              }
              console.log("update status");
              res.status(200).json({token: token, role: role});
              return;
            })
        }).catch(() => {
          res.status(500);
        })
    }
  })

}

User.logout = (req, res, next) => {
  const id = req.body.id;

  sql.query(`SELECT * FROM user WHERE id = ?`,[id], (err, result) => {
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

User.resetPassword = async (req, res, next) => {
  const email = req.body.email;
  sql.query(`SELECT * FROM user WHERE email = ?`, [email.toLowerCase()], (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(500).json({message: err});
      return;
    }

    if (result.length) {
      const user = result[0];
      const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, { expiresIn: '24h' });

      const mailOptions = {
        from: 'camille.naulet03@gmail.com',
        to: email,
        subject: 'Modifier votre mot de passe',
        text: `Cliquez sur le lien suivant pour modifier votre mot de passe : process.env.ENVFRONT/change-password?token=${token}&userId=${user.id}`,
        html: `<p>Cliquez sur le lien suivant pour modifier votre mot de passe : <a href="${process.env.ENVFRONT}/change-password?token=${token}&userId=${user.id}">Modifier mot de passe</a></p>`,
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      const response = result[0];
      res.status(200).json({response});
      return;
    }

    res.status(500).json({ kind: "not_found" });
  });
};

User.changePassword = async (req, res, next) => {
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
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  sql.query(
    "UPDATE user SET password = ? WHERE id = ?",
    [hashedPassword, req.body.id],
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).json({message: err});
        return;
      }

      if (res.affectedRows == 0) {
        res.status(500).json({kind: "not_found"});
        return;
      }

      console.log("reset password user: ", {...req.body});
      res.status(200).json({id: req.body.id, ...req.body});
    }
  );
};

User.changeRole = async (req, res, next) => {
  const newRoleId = req.body.role;
  const user = req.body.user;
  sql.query(
    "UPDATE user SET id_role = ? WHERE email = ?",
    [newRoleId, user],
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).json({message: err});
        return;
      }

      if (res.affectedRows == 0) {
        res.status(500).json({kind: "not_found"});
        return;
      }

      console.log("change role user: ", {...req.body});
      res.status(200).json({id: req.body.id, ...req.body});
    }
  );
};

User.getPatients = async (req, res, next) => {
  sql.query(
    "SELECT id, first_name, last_name FROM user WHERE id_role = ?",
    [5],
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).json({message: err});
        return;
      }

      if (res.affectedRows == 0) {
        res.status(500).json({kind: "not_found"});
        return;
      }
      res.status(200).json({id: req.body.id, result});
    }
  );
};

User.getUser = async (req, res, next) => {
  sql.query(
    "SELECT id, first_name, last_name FROM user WHERE id = ?",
    [req.query.id],
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        res.status(500).json({message: err});
        return;
      }

      if (res.affectedRows == 0) {
        res.status(500).json({kind: "not_found"});
        return;
      }
      res.status(200).json({id: req.body.id, result});
    }
  );
};

module.exports = User;

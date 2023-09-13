const sql = require("../database/db.js");
const Appointment = require("../models/appointment");
const moment = require('moment');

Appointment.create = async (req, res, next) => {
  sql.query("SELECT * FROM user WHERE id = ?", [req.body.id_practitioner], (selectErr, selectResult) => {
    if (selectErr) {
      console.log("error: ", selectErr);
      res.status(500).json({message: selectErr});
      return;
    }

    if (selectResult[0].id_role !== 5) {
      req.body.start_time = moment(req.body.start_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      req.body.end_time = moment(req.body.end_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      sql.query("INSERT INTO appointment SET ?", req.body, (insertErr, insertResult) => {
        if (insertErr) {
          console.log("error: ", insertErr);
          res.status(500).json({message: insertErr});
          return;
        }
        res.status(201).json({insertResult});
      });
    } else {
      res.status(500).json({message: 'No permission'});
    }
  });
};

Appointment.getAll =  async (req, res, next) => {
  sql.query("SELECT id_role FROM user WHERE id = ?", [req.query.id_user], (selectErr, selectResult) => {
    if (selectErr) {
      console.log("error: ", selectErr);
      res.status(500).json({message: selectErr});
      return;
    }

    if (selectResult[0].id_role == 5) {
      console.log("PASS");

      // get patient appointement
      sql.query("SELECT id_practitioner, start_time, end_time, comment, state FROM appointment WHERE id_patient = ?", req.query.id_user, (selectErr, selectResult) => {
        if (selectErr) {
          console.log("error: ", selectErr);
          res.status(500).json({message: selectErr});
          return;
        }
        console.log(selectResult);
        res.status(200).json({selectResult});
      });
    } else {

      // get practitioner appointement
      sql.query("SELECT * FROM appointment WHERE id_practitioner = ?", req.query.id_user, (selectErr, selectResult) => {
        if (selectErr) {
          console.log("error: ", selectErr);
          res.status(500).json({message: selectErr});
          return;
        }
        res.status(200).json({selectResult});
      });
    }
  });
};

module.exports = Appointment;

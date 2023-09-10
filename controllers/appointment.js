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

module.exports = Appointment;

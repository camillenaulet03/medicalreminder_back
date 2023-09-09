const Appointment = function(appointment) {
  this.start_time = appointment.start_time;
  this.end_time = appointment.end_time;
  this.comment = appointment.comment;
  this.state = appointment.state;
  this.id_practitioner = appointment.id_practitioner;
  this.id_patient = appointment.id_patient;
};

module.exports = Appointment;

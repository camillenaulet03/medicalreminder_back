const User = function(user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.phone = user.phone;
  this.email = user.email;
  this.password = user.password;
  this.missed_appointments = user.missed_appointments;
  this.id_role = user.id_role;
};

module.exports = User;

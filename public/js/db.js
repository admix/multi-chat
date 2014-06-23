function addEmail(db, email) {
  "use strict";
  var emails = db.collection("emails");
  var check = checkEmail(db, email);

  if(check === true) {
    emails.insert({'email':email}, function(err, inserted) {
      if(err){
        return err;
      }
      check
      console.log("New email successfuly inserted!");
      return email;
    });
  } else {
    return "Email already used!";
  }
}

function checkEmail(db, email) {
  return true;
}
exports.addEmail = addEmail;

function addEmail(db, email, callback) {
  "use strict";
  var emails = db.collection("emails");

  emails.insert({'email':email}, function(err, inserted) {
    if(err) throw "in insert: " + err;
    
    callback(null, email);
    return email;
  });
}

function checkEmail(db, email, callback) {
  "use strict";
  var emails = db.collection("emails");

  emails.findOne({'email':email}, function(err, doc) {
    if(err) throw "in find: " + err;

    if(doc != null) {
      callback(null, doc.email);
      return false;
    }

    callback(null);
    return null;
  });
}
exports.addEmail = addEmail;
exports.checkEmail = checkEmail;

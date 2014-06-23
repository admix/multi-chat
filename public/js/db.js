function addEmail(db, email, callback) {
  "use strict";
  var emails = db.collection("emails");
  console.log("ready to insert");
  
  emails.insert({'email':email}, function(err, inserted) {
    if(err){
      callback(null);
      return err;
    }
    callback(null, email);
    console.log("New email successfuly inserted!");
    return email;
  });
}

function checkEmail(db, email, callback) {
  "use strict";
  var emails = db.collection("emails");

  emails.findOne({'email':email}, function(err, doc) {
    if(err){
      callback(null);
      return err;
    }
    if(doc != null) {
      console.log("doc = " + doc.email);
      callback(null, doc.email);
      return false;
    }
    console.log("doc2 = " + doc);
    callback(null);
    return null;
  });
}
exports.addEmail = addEmail;
exports.checkEmail = checkEmail;

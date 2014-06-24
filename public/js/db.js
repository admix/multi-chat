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

function testEmail(db, email, callback) {
  "use strict";
  var emails = db.collection("emails");
  emails.findAndModify(
  {"email": email}, // query
  [['_id','asc']],  // sort order
  {$set: {}},
  {upsert:true}, // options
  function(err, object) {
      if (err){  //error
        console.warn(err.message);
      }else if(object.email == undefined) {  // returns error if no matching object found
        callback(null);
        return true;
      }else {
        callback(null, object.email);
        return false;
      }
  });
}
exports.testEmail = testEmail;
exports.addEmail = addEmail;
exports.checkEmail = checkEmail;

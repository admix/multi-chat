var nodemailer = require('nodemailer'),
    habitat = require("habitat");

habitat.load();

var env = new habitat(),
    useremail = env.get("EMAIL"),
    userpwd = env.get("PASS");


function sendEmail(user) {
  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: useremail,
          pass: userpwd
      }
  });
  var body = "<p>any html text ✔ </p>"
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "Alexander Snurnikov ✔ <admix.software@gmail.com>", // sender address
      to: user, // list of receivers
      subject: "Wellcome to Plottio ✔", // Subject line
      text: "Hi there! ✔", // plaintext body
      html: "<b>Hi there!</b>" + body// html body
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
}

exports.sendEmail = sendEmail;

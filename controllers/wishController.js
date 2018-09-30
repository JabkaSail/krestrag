var data = [{item: 'get milk'}, {item: 'walk dog'}]
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
 password : 'ApoD_rasStRELny',
// password : 'password',
  database : 'WantIt'
 });



module.exports = function(app){
   con.connect(function(err) {
     app.get('/wishes/', function(req, res){
         
          con.query("SELECT * FROM `WishesDb` WHERE `Group` = ?", [req.session.GroupName], function (err, rows, result) {
        if (err) throw err;
        var popa = JSON.parse(JSON.stringify(rows));
        res.render('wishes2', {group: req.session.GroupName, data: popa, user: req.session.User});
        });
      });
     app.post('/wishes', urlencodedParser, function(req, res){
         var wish = (req.body.AddWish).replace(/\r?\n/g, "");
        var values = {
        Wish: wish,
        Group: req.session.GroupName,
        User: req.session.User
    }
     if (wish == ""){
          var values = {
        Wish: "Nope",
        Group: req.session.GroupName,
        User: req.session.User
    }
     }
   con.query("INSERT INTO WishesDb SET ?", values, function (err, rows, fields) {
              if (err) throw err;
           
         
          con.query("SELECT * FROM `GroupsDb` WHERE `Name` = ?", [req.session.GroupName],   function (err, rows, result) {
               var popa = JSON.parse(JSON.stringify(rows));
               con.query("SELECT COUNT(*) AS count FROM `GroupsDb` WHERE `Name` = ?", [req.session.GroupName], function (err, rows, fields) {
    if (err) throw err;
    count = rows[0].count;
              
               for (var ei =0; ei<count ; ei++){
                   var jopa = popa[ei].User;
              con.query("SELECT * FROM `UserDb` WHERE `User` = ?", [jopa], function (err, rows, result) {
                  
              var popak = JSON.parse(JSON.stringify(rows));
                   console.log(popak);
        var email = popak[0].email;
        console.log(email +  " мыло");
       
  nodemailer.createTestAccount((err, account) => {
     console.log(email +  " ssssмыло");
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp3.mchost.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'krestrage@jabkadev.com', // generated ethereal user
            pass: 'MashkaSuperGood' // generated ethereal password
        },
         tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '" Крестраж! " <krestrage@jabkadev.com>', // sender address
        to: email, // list of receivers
        subject: 'Появилось желание в вашей группе', // Subject line
        text: req.session.User+' хочет '+wish, // plain text body
        html: '<b>'+req.session.User+' теперь хочет '+wish+'</b>'+
        '<br> <a href="krestrage.com">'+'Перейти на Крестраж'+'</a>'// html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});  
             });
                   
                        }
                    });
                        });
                         
         });
          res.redirect('/wishes/');
         
         

     });
     
     //app.delete('/wishes/delete/:wish', function(req, res){
        
    // });
     app.get('/wishes/delete/:wish', function(req, res){
          con.query("DELETE FROM `WishesDb` WHERE `Group` = ? AND `Wish` = ?", [req.session.GroupName, req.params.wish], function (err, rows, result) {
        if (err) throw err;
          res.redirect('/wishes/');
        });
     }); 
       
            app.get('/wishes/select/:wish', function(req, res){
                var val = {
                    Wid: req.session.User
                            }
          con.query("UPDATE `WishesDb` SET ? WHERE `Group` = ? AND `Wish` = ?", [val, req.session.GroupName, req.params.wish], function (err, rows, result) {
        if (err) throw err;
          res.redirect('/wishes/');
        });
     });   
       
           app.get('/wishes/unselect/:wish', function(req, res){
                var val = {
                    Wid: 0
                            }
          con.query("UPDATE `WishesDb` SET ? WHERE `Group` = ? AND `Wish` = ?", [val, req.session.GroupName, req.params.wish], function (err, rows, result) {
        if (err) throw err;
         res.redirect('/wishes/');
        });
     });   
       
     });
 };
                      
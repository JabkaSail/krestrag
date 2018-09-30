var data = [{item: 'get milk'}, {item: 'walk dog'}]
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('mysql');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ApoD_rasStRELny',
 //password : 'password',
  database : 'WantIt'
 });



module.exports = function(app){
   con.connect(function(err) {
       
     //GET Req  
       
     app.get('/user/:userid/', function(req, res){
         var userid = req.params.userid;
          con.query("SELECT * FROM `UserDb` WHERE `User` = ?", [userid], function (err, rows, result) {
        if (err) throw err;
        var popa = JSON.parse(JSON.stringify(rows));
        res.render('users', {data: popa, group: popa[0].group,  user: req.params.userid});

        });
      });
       
       //POST Req  
       
     app.post('/registration', urlencodedParser, function(req, res){
         var  User = req.body.login.replace(/^\s+|\s+$/g, '');
          var password = req.body.password.replace(/^\s+|\s+$/g, '');
        var email = req.body.email.replace(/^\s+|\s+$/g, '');
        var values = {
        User: req.body.login.replace(/^\s+|\s+$/g, ''),
        password: req.body.password.replace(/^\s+|\s+$/g, ''),
        email: req.body.email.replace(/^\s+|\s+$/g, ''),
    }
          if (User == "" || password == "" || email == "" ){
                   res.render('reg',{CurrentLogin: 1, proverka: 1});
          }
         else {
                  con.query("SELECT User, password FROM `UserDb` WHERE `User` = ? OR `email` = ?", [req.body.login, req.body.email], function (err, rows, result) {
        if (err) throw err;
                       var popa = JSON.parse(JSON.stringify(rows));
                    if (popa[0] == undefined){
                        
          
                   con.query("INSERT INTO UserDb SET ?", values, function (err, rows, fields) {
              if (err) throw err;
            });
          req.session.User = req.body.login;
            console.log(req.session.User + " userscontroller");
          res.redirect('/groups');
            }
                      else{
                          if (popa[0].User == req.body.login && popa[0].password == req.body.password){
                               req.session.User = req.body.login;
          res.redirect('/groups');
                          }
                          else{
                          res.render('reg',{CurrentLogin: 1, proverka: 0});
                      }
                          }
        });
}
     });
     
    //GET Login Req     
       
     app.get('/login', function(req, res){
      res.render('reg',{CurrentLogin: 0, proverka: 0});
      
     }); 
       
       app.post('/user/:userid', function(req, res){
           req.session.User = null;
        
         res.redirect('/login');
      
     }); 
   
       
/*            app.get('/user/:userid/group/:group/wish/:wish/select', function(req, res){
                var val = {
                    Wid: 1
                            }
          con.query("UPDATE `WishesDb` SET ? WHERE `Group` = ? AND `Wish` = ?", [val, req.params.group, req.params.wish], function (err, rows, result) {
        if (err) throw err;
         res.redirect('/user/'+req.params.userid+'/group/'+req.params.group+'/wish/');
        });
     });   
   */    
     });
 };                      
var data = [{item: 'get milk'}, {item: 'walk dog'}]
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var uniqid = require('uniqid');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ApoD_rasStRELny',
 //password : 'password',
  database : 'WantIt'
 });



module.exports = function(app){
    //GET Req
   con.connect(function(err) {
         app.get('/groups', function(req, res){
                if (req.session.User != null){
          console.log(req.session.User + " group");
          con.query("SELECT * FROM `GroupsDb` WHERE `User` = ?", [req.session.User], function (err, rows, result) {
        if (err) throw err;
              var popa = JSON.parse(JSON.stringify(rows));
                con.query("SELECT * FROM `UserDb` WHERE `User` = ?", [req.session.User], function (err, rows, result) {
               console.log(rows);
        var popas = JSON.parse(JSON.stringify(rows));
                    if (popa[0] == null){
                        req.session.Group = 'none'
                    }
                    else {
                        req.session.GroupName = popas[0].group
                    req.session.GroupCode = popa[0].uniqid;
                        }
        res.render('groups', {data: popa, user: req.session.User, selected: popas[0].group,  error: 0});
        });
                    });
                    } else{
                       res.redirect('/login');
      }
     });  
     
     //POST Req  
       
     app.post('/groups', urlencodedParser, function(req, res){
            if (req.session.User != null){
    var Group = (req.body.AddWish).replace(/\r?\n/g, "");
        var values = {
        Name: Group,
        User: req.session.User,
        Author: req.session.User
    }
     if (Group == ""){
     next();
     }
            con.query("SELECT * FROM `GroupsDb` WHERE `Name` = ?", [Group], function (err, rows, result) {
        if (err) throw err;
                 var values = {
                     uniqid: uniqid(),
        Name: Group,
        User: req.session.User,
        Author: req.session.User,
        InviteCode: uniqid(Group+'-')             
    }
        var popa = JSON.parse(JSON.stringify(rows));
     if (popa[0] == undefined) {
       
   con.query("INSERT INTO GroupsDb SET ?", values, function (err, rows, fields) {
              if (err) throw err;
       var Group = {
           group: Group
       }
          con.query("UPDATE `UserDb` SET ? WHERE User = ?", [Group, req.session.User], function (err, rows, result) {
        if (err) throw err;
            });
                }); 
          res.redirect('/groups');
                }
                else{
        if (req.session.User != null){
          console.log(req.session.User + " group");
          con.query("SELECT * FROM `GroupsDb` WHERE `User` = ?", [req.session.User], function (err, rows, result) {
        if (err) throw err;
              var popa = JSON.parse(JSON.stringify(rows));
                con.query("SELECT * FROM `UserDb` WHERE `User` = ?", [req.session.User], function (err, rows, result) {
               console.log(rows);
        var popas = JSON.parse(JSON.stringify(rows));
                    if (popa[0] == null){
                        req.session.Group = 'none'
                    }
                    else {
                    req.session.GroupName = popas[0].group;
                        }
        res.render('groups', {data: popa, user: req.session.User, selected: popas[0].group,  error: 1});
        });
                    });
                    } else{
                       res.redirect('/login');
      }
                }
     });
        } else{
                       res.redirect('/login');
      }
     }); 
       //GET DELETE Req  
       
      app.get('/delete/:group', function(req, res){
          if (req.session.User != null){
          con.query("DELETE FROM `GroupsDb` WHERE `uniqid` = ? AND `Author` = ?", [req.params.group, req.session.User], function (err, rows, result) {
        if (err) throw err;
       
             
               con.query("DELETE FROM `GroupsDb` WHERE `uniqid` = ? AND `User` = ?", [req.params.group, req.session.User], function (err, rows, result) {
        if (err) throw err;
         res.redirect('/groups');
              });
               });
                    }
                    
                    else{
                       res.redirect('/login');
                    }
        });
    
       
        //GET SELECT Req  
       
        app.get('/select/:group', function(req, res){
             if (req.session.User != null){
       
            req.session.GroupCode = req.params.group;
                 con.query("SELECT * FROM `GroupsDb` WHERE `User` = ? AND `uniqid` = ?", [req.session.User, req.session.GroupCode], function (err, rows, result) {
        if (err) throw err;
            
              var popa = JSON.parse(JSON.stringify(rows));
                     if (popa[0] == null){
                         res.redirect('/groups');
                     }
                     else{
                          req.params.group = popa[0].Name;
                   req.session.GroupName = popa[0].Name;
                          var value = {
                group: req.session.GroupName
            }
          con.query("UPDATE `UserDb` SET ? WHERE User = ?", [value, req.session.User], function (err, rows, result) {
        if (err) throw err;
        
        res.redirect('/groups');
              
               });
                        } 
                      });
                } 
    else{
                       res.redirect('/login');
      }
       
     });
       
               app.get('/groups/:group/', function(req, res){
                if (req.session.User != null){
          //console.log(req.session.User + " group");
          con.query("SELECT * FROM `GroupsDb` WHERE `uniqid` = ?", [req.params.group], function (err, rows, result) {
        if (err) throw err;
        var popas = JSON.parse(JSON.stringify(rows));
                    if (popas[0] == null){
                          res.redirect('/groups');
                    }
                    else {
                  res.render('group', {data: popas, user: req.session.User, selected: popas[0].Name });
                        }
        
        });
                  
                    } else{
                       res.redirect('/login');
      }
     }); 
       
                    app.get('/groups/:group/delete/:userid/', function(req, res){
                if (req.session.User != null){
          con.query("SELECT * FROM `GroupsDb` WHERE `uniqid` = ?", [req.params.group], function (err, rows, result) {
        if (err) throw err;
        var popas = JSON.parse(JSON.stringify(rows));
                    if (popas[0] == null){
                          res.redirect('/groups');
                    }
                    else {
                        if (popas[0].Author == req.session.User){
                           // console.log("DSNGJNDSGLJBH");
                             con.query("DELETE FROM `GroupsDb` WHERE `User` = ?", [req.params.userid], function (err, rows, result) {
        if (err) throw err;
                                   res.redirect('/groups/'+req.params.group);
                                 });
                        }
                        else {
                            res.redirect('/groups');
                        }
                
                        }
        
        });
                    } else{
                       res.redirect('/login');
      }
     }); 
       
        app.get('/invite/:code', function(req, res){
          if (req.session.User != null){
               var str = req.params.code;
               var spliter = str.split("-");
             
              var Group =  spliter[0];
              con.query("SELECT * FROM `GroupsDb` WHERE `Name` = ?", [Group], function (err, rows, result) {
                   var popa = JSON.parse(JSON.stringify(rows));
                  if (popa[0].InviteCode == str){
                      
                  var value = {
                  group: spliter[0]
              }
           con.query("UPDATE `UserDb` SET ? WHERE User = ?", [value, req.session.User], function (err, rows, result) {
        if (err) throw err;
               value = {
                   InviteCode: uniqid(Group+'-')
               }
          
        con.query("UPDATE `GroupsDb` SET ? WHERE Name = ?", [value, Group], function (err, rows, result) {
        if (err) throw err;
            
            value = {
        uniqid: popa[0].uniqid,
        Name: Group,
        User: req.session.User,
        Author: popa[0].Author,     
        InviteCode: popa[0].InviteCode         
            }
            
              delete Group;
            con.query("INSERT INTO GroupsDb SET ?", value, function (err, rows, fields) {
        res.redirect('/groups');
                    });
              
               });
                });
                       }
                  else {
                      res.redirect('/groups');
                  }
                   });
               }
                    
                    else{
                        req.session.gCode = req.params.code;
                       res.redirect('/login');
                    }
        });
       
      });
 };
        
   
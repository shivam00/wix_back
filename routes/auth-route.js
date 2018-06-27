const router = require('express').Router();
const passport = require('passport');
const express = require('express');
var LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
var base64 = require('base-64');
var utf8 = require('utf8');
const app = express();
const con = require('../config/db');
var cors = require('cors');
var bodyParser = require('body-parser');
const uidGenerator = require('node-unique-id-generator');

//App USe
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:1234'}));
//End of App USe

//Passport Configuration
passport.serializeUser(function(user, done) {

    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    console.log(id);
    con.query("select * from user_manual where id = '"+id+"'",function(err,rows){ 
      done(err, rows[0]);
    });

});
//End of Passport COnfiguration


//Management Routes

router.get('/mywebsites', (req,res)=>{
let sql = `SELECT * FROM mywebsites WHERE user_id=?`;
con.query(sql, [req.user.id], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
    return res.send(false);
  }
  console.log(results);
  return res.send(results);
});
    
});

router.post('/add_title',(req, res)=>{
    app.set('mytitle', req.body.title);
   res.send(true);
});


router.post('/add_about',(req, res)=>{
   about = req.body.about;
   user_id = req.user.id;
   let stmt = `INSERT INTO mywebsites(id, user_id, title, about)
            VALUES(?,?,?,?)`;
let todo = [uidGenerator.generateUniqueId(), user_id, app.get('mytitle'), about];
 // execute the insert statment
con.query(stmt, todo, (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  // get inserted id
  console.log('Todo Id:' + results.insertId);
  res.send(true);
});


});



//End of Management Routes




//Login Routes
passport.use(new LocalStrategy(
  function(username, password, done) {

let sql = `SELECT * FROM user_manual WHERE email=? AND password=?`;
con.query(sql,[username,password], (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  if(results.length > 0){
      done(null, results[0]);
      console.log("Doned!!");
    console.log(results[0]);
  }else{
return done(null, false);
  }

});
}
));

router.get('/google', passport.authenticate('google',{
    scope:['profile']
}));

router.get('/google/redirect',passport.authenticate('google'), (req, res) => {
// var encoded = req.cookies.session;
// var bytes = base64.decode(encoded);
// var text = utf8.decode(bytes);
// console.log(text);
//         console.log('Cookies2: ', req.cookies)
        res.redirect('http://localhost:1234/mywebsites/');
   
});

router.get('/logout',(req, res)=>{
    req.logout();
    res.send(true);
});
//End of Login Routes

module.exports = router;
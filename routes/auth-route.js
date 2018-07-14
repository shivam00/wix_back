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
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

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


router.get('/mywebsites', (req,res)=>{
let sql = `SELECT * FROM mywebsites WHERE id=?`;
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
   let stmt = `INSERT INTO mywebsites(id, title, about)
            VALUES(?,?,?)`;
let todo = [user_id, app.get('mytitle'), about];
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

router.post('/add_about2',(req, res)=>{
  console.log(req.body);
   heading = req.body.heading;
   content = req.body.content;
   let stmt = `INSERT INTO sections(id, category, image, heading, content)
            VALUES(?,?,?,?,?)`;
let todo = [req.user.id, "ABOUT",  app.get('image_name'), heading, content];
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

router.post('/add_team',(req, res)=>{
  console.log(req.body);
   heading = req.body.heading;
   content = req.body.content;
   let stmt = `INSERT INTO sections(id, category, image, heading, content)
            VALUES(?,?,?,?,?)`;
let todo = [req.user.id, "TEAM",  app.get('image_name'), heading, content];
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

router.post('/add_portfolio',(req, res)=>{
  console.log(req.body);
   heading = req.body.heading;
   content = req.body.content;
   let stmt = `INSERT INTO sections(id, category, image, heading, content)
            VALUES(?,?,?,?,?)`;
let todo = [req.user.id, "PORTFOLIO",  app.get('image_name'), heading, content];
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

router.post('/upload',(req, res)=>{
  var upload = multer({
    storage: storage
  }).single("file")
  upload(req, res, function(err) {
    if(err){
      console.log(err);
    res.send(false);  
    }else{
      mime = req.file.mimetype;
      full_name = req.file.filename+"."+mime.slice(6, mime.length);
      console.log(full_name);
    app.set('image_name',full_name);
    console.log(req.file);
    res.send(true);
    }
    
  });

   
   

//    let stmt = `INSERT INTO mywebsites(id, title, about)
//             VALUES(?,?,?)`;
// let todo = [user_id, app.get('mytitle'), about];
//  // execute the insert statment
// con.query(stmt, todo, (err, results, fields) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   // get inserted id
//   console.log('Todo Id:' + results.insertId);
//   res.send(true);
// });
});



router.post('/add_service',(req, res)=>{
 icon = req.body.icon;
  heading = req.body.heading;
   content = req.body.content;

console.log(req.body);
   let stmt = `INSERT INTO sections(id, category, icon, heading, content)
            VALUES(?,?,?,?,?)`;
let todo = [req.user.id, "SERVICES", icon, heading, content];
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


router.post('/update_initials',(req, res)=>{

 title = req.body.title;
  subTitle = req.body.subTitle;
   buttonText = req.body.buttonText;
    buttonLink = req.body.buttonLink;


    let sql = `UPDATE mywebsites
           SET title = ? , subtitle = ? , buttonText = ? , buttonLink = ?
           WHERE id = ?`;
 
let data = [title, subTitle, buttonText, buttonLink, req.user.id];
 
// execute the UPDATE statement
con.query(sql, data, (error, results, fields) => {
  if (error){
    return console.error(error.message);
  }
  res.send(true);
  console.log("Updated");
});
});




// router.post('/update_service',(req, res)=>{

//  icon = req.body.icon;
//   heading = req.body.heading;
//    content = req.body.content;
    


// let sql = `SELECT * FROM sections WHERE id=? AND category=?`;
// con.query(sql, [req.user.id, "services"], (error, results, fields) => {
//   if (error) {
//     return console.error(error.message);
//   }
//   if(results != null){

// //UPDATE
// let sql = `UPDATE sections
//            SET icon = ? , heading = ? , content = ?
//            WHERE id = ? AND category=?`;
 
// let data = [icon, heading, content, req.user.id, "services"];
 
// // execute the UPDATE statement
// con.query(sql, data, (error, results, fields) => {
//   if (error){
//     return console.error(error.message);
//   }
//   res.send(true);
//   console.log("Updated");
// });

// }else{

//   //INSERT NEW
// }
// });
 









// });


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
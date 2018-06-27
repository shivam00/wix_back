const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const Keys = require('./keys');
const con = require('./db');
var uniqid = require('uniqid');


con.connect(function(err) {
    if (err) throw err;
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    con.query("select * from users where id = '"+id+"'",function(err,rows){	
      done(err, rows[0]);
    });

});



passport.use(new GoogleStrategy({
//Here goes strategy
callbackURL:'/auth/google/redirect',
clientID :Keys.google.clientID,
clientSecret : Keys.google.clientSecret

}, (accessToken, refreshToken, profile, done) => {

console.log(profile);

let sql = `SELECT * FROM users WHERE social_id=?`;
con.query(sql,profile.id, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  if(results.length > 0){
      done(null, results[0]);
      console.log("This person already exixts");
    console.log(results[0]);
  }else{
    
    var newUserMysql = new Object();

    UID = uniqid(profile.id);
     newUserMysql.id = UID;
     newUserMysql.name = profile.displayName;
     newUserMysql.social_id = profile.id;


    var sql = "INSERT INTO users (id, name, social_id) VALUES ('"+UID+"','"+ profile.displayName+"', '"+profile.id+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      console.log(result);
      done(null, newUserMysql);
    });

  }
  
});

  

    
})

);
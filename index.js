const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-route.js');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const Keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
 var cors = require('cors')
var bodyParser = require('body-parser');

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:1234");
//   res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:1234'}));
app.use(cookieSession({
maxAge:24*60*60*1000,
keys:['mysecret']
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(cookieParser())
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);





app.listen(	3000, () => console.log('listening to port'));
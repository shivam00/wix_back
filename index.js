const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-route.js');
const passportSetup = require('./config/passport-setup');


app.use('/auth',authRoutes);

app.get('/', (req, res) => {

	res.send('hello world');
});

app.listen(	3000, () => console.log('listening to port'));
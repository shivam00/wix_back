const router = require('express').Router();

const authCheck = (req, res, next) =>{
    if(!req.user){
        res.redirect('/');
    }else{
        next();
    }
};

router.get('/', authCheck, (req, res) =>{
	console.log(req.user);
    //res.send("Welcome "+req.user.name);
    //console.log(req.user);
    res.send('done');
});

module.exports = router;
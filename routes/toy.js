require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Toy = require('../db/models/toy');
const User = require('../db/models/user');
const googleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (_id, done) {
    User.findById(_id, function (err, user) {
        done(err, user);
    });
});



passport.use(new googleStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.secret,
    callbackURL: "http://localhost:8080/toy/google/auth/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        console.log(accessToken);
        const [firstName, lastName] = profile.displayName.split(" ");
        User.findOrCreate({ googleId: profile.id, username: profile.sub, firstName: firstName, lastName: lastName, email: profile.email }, function (err, user) {
            cb(err, user);
        });
    }
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/auth/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/home'
    }),
    (req, res) => {
        //console.log(req)
    }

)


router.get('/', (req, res) => {
    res.send('Hello world');
})

router.post('/postToy', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log(req.body);
            const data = await Toy.create(req.body);
            res.redirect('/viewToys');
        }
        else {
            res.send('Unauthorized');
        }

    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
})


router.post('/updateToy/:id', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const data = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.redirect('/viewToys')
        }
        else {
            res.send('Unauthorized');
        }

    }
    catch (err) {
        console.log(err);
    }
})

router.post('/findToy', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log('find by name ', req.body)
            const data = await Toy.find({ name: req.body.name });
            if (data.length === 0) {
                res.status(200).json({ status: false, 'msg': 'No data found' });
            }
            else {
                res.render('toyByName.ejs', { data: data[0] })
            }
        }
        else {
            res.send('Unauthorized');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
})

router.get('/delete/:id', async (req, res) => {
    if(req.isAuthenticated()){
        try {
            await Toy.findByIdAndDelete(req.params.id);
            res.redirect('/viewToys');
        }
        catch (err) {
            res.status(500);
        }
    }   
    else res.send('Unauthorized');
    
})

module.exports = router;
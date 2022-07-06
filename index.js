const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const toy = require("./routes/toy");
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs');
const Toy = require('./db/models/toy');
app.set('view engine', ejs);
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "A ver LONG STRING",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./db/conn');


app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('homepage.ejs');
    }
    else {
        res.send('Not authorized');
    }
})

app.get('/addToy', (req, res) => {
    res.render('addToy.ejs');
})

app.get('/viewToys', async (req, res) => {
    const data = await Toy.find({});
    res.render('viewToys.ejs', { data: data });
})

app.get('/editToy/:id', async (req, res) => {
    try {
        console.log('request at edit', req.params);
        const data = await Toy.findById(req.params.id);
        // console.log(data);
        res.render('editToy.ejs', {data : data});
    }
    catch(err){
        console.log(err);
        res.status(500);
    }
    
})

app.get('/search', (req, res)=>{
    res.render('searchByName.ejs');
})

app.use('/toy', toy);


app.listen(port, () => {
    console.log("server listening at port 8080");
})
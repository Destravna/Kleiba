require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://root:${process.env.dbpass}@cluster0.gw2de.mongodb.net/toys?retryWrites=true&w=majority`,
    {useNewUrlParser : true})
    .then(console.log('Connected successfully'))
    .catch(err=>{
        console.log(err);
    });

const mongoose = require('mongoose');

const toySchema = new mongoose.Schema({
    'name' : {
        type : String,
        required : true
    },
    'cost' :{
        type : Number,
        required : true
    },
    'unitsSold' : {
        type : Number
    }
});

const Toy = mongoose.model('toy', toySchema);

module.exports = Toy;
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const userSchema = mongoose.Schema({
    googleId : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.plugin(findOrCreate);
const User = mongoose.model('user', userSchema);

module.exports = User;
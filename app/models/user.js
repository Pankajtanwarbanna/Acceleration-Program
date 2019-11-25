var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex', true);

var userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    position : {
        type : String,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    address : {
        type : String,
    },
    active : {
        type : Boolean,
        required : true,
        default : false
    },
    temporarytoken : {
        type : String,
        required : true
    },
    permission : {
        type : String,
        required : true,
        default: 'user'
    }
});

userSchema.pre('save', function (next) {

    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if(err) {
            return next(err);
            //res.send('Error in hashing password');
        } else {
            user.password = hash;
            next();
        }
    });
});

// Mongoose title case plugin
userSchema.plugin(titlize, {
    paths: [ 'name' , 'branch'], // Array of paths
});

// Password compare method
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);

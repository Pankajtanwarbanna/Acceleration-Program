var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var workstationSchema = new mongoose.Schema({
    work : {
        type : String,
        required : true
    },
    user_email : {
        type : String,
        required : true
    },
    work_url : {
        type : String
    },
    timestamp : {
        type : Date,
        required : true
    }
});

module.exports = mongoose.model('Workstation',workstationSchema);

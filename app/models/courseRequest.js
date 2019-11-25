var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

let courseRequestSchema = new mongoose.Schema({
    course : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    preferred_format : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
courseRequestSchema.plugin(titlize, {
    paths: [ 'category'], // Array of paths
});

module.exports = mongoose.model('CourseRequest',courseRequestSchema);

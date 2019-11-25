var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var courseSchema = new mongoose.Schema({
    course_name : {
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
    course_url : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
courseSchema.plugin(titlize, {
    paths: [ 'course_name'], // Array of paths
});

module.exports = mongoose.model('Course',courseSchema);
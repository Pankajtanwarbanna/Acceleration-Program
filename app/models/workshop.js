var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var workshopSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    presenter : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    venue : {
        type : String,
        required : true
    },
    time_date : {
        type : Date,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    poster : {
        type : String,
        required : true,
        default : 'workshop_poster.jpeg'
    },
    timestamp : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
workshopSchema.plugin(titlize, {
    paths: [ 'title','presenter','venue'], // Array of paths
});

module.exports = mongoose.model('Workshop',workshopSchema);

var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var categorySchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
categorySchema.plugin(titlize, {
    paths: [ 'category'], // Array of paths
});

module.exports = mongoose.model('Category',categorySchema);

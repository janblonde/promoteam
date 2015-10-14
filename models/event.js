var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    start: String,
    end: String});
var Event = mongoose.model('Event',Event);
module.exports=Event;
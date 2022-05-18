const mongoose = require('mongoose')
const newsSchema = new mongoose.Schema({
    Symbol:{
        type:String,
        required:true
    },

    Name:{
        type:String,
    },
})
// stockSchema.index({ticker:1, user:1},{unique:true})
module.exports = mongoose.model('Symbols',newsSchema);

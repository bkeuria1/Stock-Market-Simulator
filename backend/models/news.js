const mongoose = require('mongoose')
const newsSchema = new mongoose.Schema({
    ticker:{
        type:String,
        required:true
    },

    title:{
        type:String,
    },
    source:{
        type:String,  
    },
    published_at:{
        type:String
    },
    url:{
        type:String
    },
    description:{
        type:String
    },
    image_url:{
        type:String
    }
})
// stockSchema.index({ticker:1, user:1},{unique:true})
module.exports = mongoose.model('News',newsSchema);

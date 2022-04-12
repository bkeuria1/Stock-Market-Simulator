const mongoose = require('mongoose')
const stockSchema = new mongoose.Schema({
    ticker:{
        type:String,
        required:true
    },
    profits:{
        type:number,
        //required:true
    },
    averagePurchasePrice:{
        type:number
    },
    quantity:{
        type:number,
        default:0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required : true
    }   
})

module.exports = mongoose.model('Stock',stockSchema);


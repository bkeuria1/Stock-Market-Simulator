const mongoose = require('mongoose')
const stockSchema = new mongoose.Schema({
    ticker:{
        type:String,
        required:true
    },

    date: {
        type: Date,
        default: Date.now(),
      },
   
    total:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required : true
    }   
})
stockSchema.index({ticker:1, user:1},{unique:true})
module.exports = mongoose.model('Stock',stockSchema);


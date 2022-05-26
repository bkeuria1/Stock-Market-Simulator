const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email:{
    type:String
  },
  image: {
    type: String,
  },
  buyingPower:{
    type: Number,
    default: 1000000
  },
  balance:{
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', UserSchema)
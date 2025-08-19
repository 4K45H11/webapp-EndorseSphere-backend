const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required : true,
        trim:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default : "user"
    }
},{timestamps:true})

module.exports = mongoose.model("User",UserSchema);
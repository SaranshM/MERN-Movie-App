const mongoose=require('mongoose');

const User = mongoose.model("User",{
    name:{
        type:String,
        trim:true,
        maxlength:100,
        default: "User"
    },
    email:{
        type:String,
        trim:true,
        maxlength:100,
        unique: true
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        maxlength:100
    },
    tokens:{
        type:Array
    },
    starred: {
        type: Array,
        default: []
    }
});

module.exports = User;
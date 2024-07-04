const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
       
    },
    role:{
        type:String,
        enum:["Admin","Student","Visitor"]//An enum, short for "enumeration," is a data type in programming languages that consists of a set of named values, called enumerators or members.
    }
});

module.exports=mongoose.model("user",userSchema);
const express=require("express");
const router=express.Router();
const User=require("../model/User");

const{login,signup}=require("../Controllers/Auth");
const{auth,isStudent,isAdmin}=require("../middleware/authmdwre");

router.post("/login",login);
router.post("/signup",signup);


// testing protected route for single middleware
router.get("/test",auth,(req,res)=>{
    res.json({
       success:true,
       message:"Welcome to the protected route for TESTS" 
    });
})

//Protectected Route and mention middleware to each path
router.get("/student",auth,isStudent,(req,res)=>{
    // yha UI nhi h to msg se kam chalana pad rha h
    res.json({
        success:true,
        message:"Welcome to the protected route for students",
    })
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for Admin",
    })
});

// using Id to get any data of user
router.get("/getEmail",auth, async(req,res)=>{
    try{
        const id=req.user.id; // ye authentication ke response se mila
        console.log("ID:", id);
        const user=await User.findById(id);

        res.status(200).json({
            success:true,
            user:user,
            message:"welcome to the email route",
        })
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"code fat gya",
        })
    }
})


module.exports=router;

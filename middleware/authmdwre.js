//we have to make three middleware

// 1.for checking auth, 2. IsStudent, 3. isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //extract jwt token
        //PENDING:-Other ways to fetch token
        console.log("cookie",req.cookies.token);
        console.log("body",req.body.token); 
        console.log("header",req.header("Authorization")); 



        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");// 3 ways to fetch the token ,header is more safe  

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            //The jwt.verify function returns the decoded payload of the JWT if the token is valid 
            console.log(payload);

            req.user = payload;// put decoded jwt in user ,payload is loaded here so we can find the role

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid",
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went Wrong while verifying Token",
        })

    }
}

exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",
            })
        }
        next();
        // message(response) for success is not written here because ,it is already written in Route
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role is not matching",
        })


    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin",
            })
        }
        next();
        // message(response) for success is not written here because ,it is already written in Route
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role is not matching",
        })


    }
}


// isStudent and isAdmin is used for Authorisation

// Cookie hijaking and token hijaking?
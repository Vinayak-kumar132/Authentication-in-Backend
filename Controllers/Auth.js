
const bcrypt = require("bcrypt");// used to hash the password

//import model
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// login
exports.login = async (req, res) => {
    try {
        //data fetch
        const { email, password } = req.body;
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill All the Details"
            })
        }

        let user = await User.findOne({ email });
        //If not a registered user
        if (!user) {
            return res.status(401).json({ // from Status code documentation ,unauthorized
                success: false,
                message: "User is not registered"
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        //Verify password and generate JWT Token
        if (await bcrypt.compare(password, user.password)) {
            //password Match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:
                    "2h"
            });


            user = user.toObject();// converting user into object
            user.token = token;


            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 30000),
                httpOnly: true,//not accessible at client-side
            }

            //we have to pass name ,data,options
            res.cookie("token", token, options).status(200).json({
                success: true,
                token, 
                user,
                message: "User Logged in successfully"
            });

           

        }
        else {
            //password do not match
            return res.status(403).json({ // 403 no permission to access
                success: false,
                message: "Incorrect Password"
            })
        }




    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure",
        });

    }
}
//signup route handler
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password, role } = req.body;
        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already Exists",
            });
        }

        //secure password

        // Retry strategy for hashing the password ??
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing Password",
            });

        }

        // Create entry for User
        const user = await User.create({
            name, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
        });


    }


    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered,Please try again later",
        })

    }
}





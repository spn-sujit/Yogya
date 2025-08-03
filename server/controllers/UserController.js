import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
export const registerUser = async(req,res)=>{

    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:'Missing details'});
    }
    try {

        const UserExists = await User.findOne({email});
        if(UserExists){
            return res.json({success:false, message:'User already registered'});
        }

        const salt = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:salt,
        
        });

        res.json({
            success:true,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            },
            token:generateToken(user._id),
        })
        
    } catch (error) {
        res.json({success:false,
            message:error.message,
        })
    }
}

export const  loginUser   = async(req,res)=>{
    const {email,password}=req.body;
    try {
        
           const user = await User.findOne({email});

            if (!user) {
      return res.json({
        success: false,
        message: 'Invalid email or password',
      });
    }

           if(bcrypt.compare(password,user.password)){
            res.json({
                success:true,
                user:{
                    _id:user.id,
                    name:user.name,
                    email:user.email,

                },
                token:generateToken(user._id),
            })
           }
           else{
            res.json({
                success:false,
                message:'Invalid email or  password',
            })
           }

    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

export const getUserData = async(req,res)=>{
    try {

        const  user = await User.findById(req.userId)
        res.json({
            success:true,
            user,
        })
        
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
}
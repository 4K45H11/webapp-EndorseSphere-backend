const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

const {generateToken} = require('../utils/generateToken.util')

exports.register = async(req,res)=>{
    try {
        const {email,password,role} = req.body;
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({message:'User already registred'})
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({email,password:hashedPassword,role})

        res.status(201).json({
            message: `New ${newUser.role} created`,
            user:newUser
        })

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message:'Invalid credentials'})
        }

        const isMatched = await bcrypt.compare(password,user.password)

        if(!isMatched){
           return  res.status(400).json({message:'Invalid credentials'})
        }

        const token = generateToken(user.role,user._id)

        res.status(200).json({
            token,
            role:user.role,
            email,
            id:user._id
        })

    } catch (error) {
        res.json({message:error.message})
    }
}
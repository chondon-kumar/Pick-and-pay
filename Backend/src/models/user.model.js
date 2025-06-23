import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true, 
        trim : true ,
        index : true ,
        unique : true,
        toLowercase : true
    },
    fullName : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        required : [true, "this email field required"],
        trim : true,
        index : true,
        unique : true,
        toLowercase : true
    },
    password : {
        type : String,
        required : [true, "this password field is required"],
        trim : true
    },
    role : {
        type : String,
        enum : ["admin", "user"],
        required : true
    },
    refreshToken : {
        token :{
            type : String,
            required : true
        },
        expiredIn : {
            type : Date
        }
    }

},{timestamps : true})

userSchema.pre("save", async function (next) {
    const hashPassword = await bcrypt.hash(this.password, 10)
    this.password = hashPassword
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    const isCorrect = await bcrypt.compare(password, this.password)
    return isCorrect
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            userName : this.userName,
            email : this.email
        },process.env.ACCESS_TOKEN_SECRET,{ACCESS_TOKEN_EXPIRES_IN}
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
        },process.env.REFRESH_TOKEN_SECRET,{REFRESH_TOKEN_EXPIRES_IN}
    )
}

export const User = mongoose.model("User", userSchema) ;
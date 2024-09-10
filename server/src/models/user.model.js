import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
       /*
        userId: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
            // index: true,
        },
        */
        phoneno: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            sparse: true //Optional But Unique
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        name: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Middleware to generate a unique userId before saving
/*
userSchema.pre("save", function (next) {
    if (!this.userId) {
      this.userId = `user${Math.floor(1000 + Math.random() * 9000)}`; // Generates userId like user1234
    }
    next();
});
*/

//Middleware for Password Hashing
userSchema.pre("save", async function (next) {
    //If the password field is not modified return next
    if(!this.isModified("password")) return next();
    
    //Else hash the password
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

// Compare Passwords
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
        return await jwt.sign(
        {
            _id: this._id,
            phoneno: this.phoneno,
            name: this.name
            //userId: this.userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
        return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
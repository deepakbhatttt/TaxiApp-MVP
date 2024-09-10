import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const driverSchema = new Schema(
    {
        // driverId: {
        //     type: String,
        //     trim: true,
        //     required: true,
        //     unique: true,
        //     // index: true,
        //     lowercase: true
        // },
        phoneno: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }

);

//Hash the Password if the password field is modified
driverSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

//Compairing the password
driverSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

driverSchema.methods.generateAccessToken = async function(){
        return await jwt.sign(
        {
            _id: this._id,
            driverId: this.driverId,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
driverSchema.methods.generateRefreshToken = async function(){
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

export const Driver = mongoose.model("Driver", driverSchema);
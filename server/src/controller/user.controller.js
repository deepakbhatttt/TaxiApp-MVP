import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res)=>{
    const {name, phoneno, email, password} = req.body;
    //console.log(email);

    //Checking if the fields are Empty.
    if([name,phoneno,password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "These Fields are Required");
    }

    //Checking If the Phone No or Email is already registered or not

    const query = { phoneno };
    if (email) {
        query.$or = [{ phoneno }, { email }];
    }
    const existedUser = await User.findOne(query);

    /*
    const existedUser = await User.findOne({
        $or: [{ phoneno }, email ? { email } : {}]
    });
    */
    if(existedUser){
        throw new ApiError(409, "User with this phone/email already exist");
    }

    //Else Create a new user with the credentials
    const user = await User.create({
        name,
        phoneno,
        email,
        password
    });

    //Checking(In DB) if the User is created or not and slecting the user details excluding password and refreshToken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500,"Error Regestering the User");
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully")
    );
    
});

export {registerUser};
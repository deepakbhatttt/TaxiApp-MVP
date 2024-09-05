import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body;
    //console.log(email);

    //Checking if the fields are empty
    if([name,email,password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Name is Required");
    }

    //Checking If the Email is already registered with us or not
    const existedUser = User.findOne({
        $or: [{name}]
    })
    if(existedUser){
        throw new ApiError(409, "User with this email already exist");
    }
    

    
})

export {registerUser};
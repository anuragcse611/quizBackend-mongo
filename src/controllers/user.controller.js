import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend(client)
  const { username, fullName, email, password } = req.body;

  //validation - for non empty fields,email, password characters, uniqueness of username
  if (
    [username, email, password, fullName].some((fields) => fields?.trim === "")
  ) {
    // returns true if any fields are null, undefined or not trimmed
    console.error(new apiError(400, "All fields are required"));
    return res.status(400).json(new apiResponse(400, null, "All fields are required"));
  }
  if (!email.includes("@") && !email.includes(".")) {
    
    console.error(new apiError(401, "invalid email address"));
    return res.status(401).json(new apiResponse(401, null, "invalid email address"));
   
  }
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(password)) {
    console.error(new apiError(402, "password must contains 8 characters"));
    return res.status(401).json(new apiResponse(402, null, "password must contains 8 characters"));
   
  }

  //check if user is already registered or not - email or username
  const response = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (response) {
    console.error(new apiError(403, "user already registered"));
    return res.status(403).json(new apiResponse(403, null, "user already registered"));
  }

  //check for images- required avatar
  const avatarImagePath = req.files?.profilePic[0]?.path;


  if (!avatarImagePath) {
    console.error(new apiError(405, "profile image required"));
    return res.status(405).json(new apiResponse(403, null, "profile image required"));
    
  }

  //upload them to cloudinary- for images
  const avatarUpload = await uploadToCloudinary(avatarImagePath);

  if (!avatarUpload) {
    throw new apiError(405, "profile image required");
  }

  //create user object - create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    profilePic: avatarUpload.url,
    fullName,
  });

  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password "
  );

  //is response coming or not- check
  if (!createdUser) {

    console.error(new apiError(500, "error in creating user"));
    return res.status(500).json(new apiResponse(403, null, "error in creating user"));
    
    
  }
   
  //if  user created return response else error

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
 
  const { email, password } = req.body;


  if (!email || !password) {
    console.error(new apiError(400, "Email and password are required"));
    return res.status(400).json(new apiResponse(403, null, "Email and password are required"));
    
  }

 
  const user = await User.findOne({ email });


  if (!user) {
    console.error(new apiError(404, "User not found"));
    return res.status(404).json(new apiResponse(403, null,"User not found"));
    
  }

 
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    console.error(new apiError(401, "Invalid password"));
    return res.status(401).json(new apiResponse(403, null, "Invalid password"));
    
  } 

  // If user and password are valid, return success response
  return res.status(200).json(new apiResponse(200,  "Login successful"));
});

const viewUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    const error = new apiError(404, "User not found");
    console.error(error);
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  return res.status(200).json(new apiResponse(200, user, "User profile fetched successfully"));
});



const editUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { fullName, email } = req.body;

  let updateData = { fullName, email };

  if (req.file) {
    const avatarImagePath = req.file.path;
    const avatarUpload = await uploadToCloudinary(avatarImagePath);

    if (!avatarUpload) {
      const error = new apiError(500, "Profile image upload failed");
      console.error(error);
      return res.status(500).json(new apiResponse(500, null, "Profile image upload failed"));
    }

    updateData.profilePic = avatarUpload.url;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

  if (!updatedUser) {
    const error = new apiError(500, "Error updating profile");
    console.error(error);
    return res.status(500).json(new apiResponse(500, null, "Error updating profile"));
  }

  return res.status(200).json(new apiResponse(200, updatedUser, "Profile updated successfully"));
});

export { registerUser, loginUser, viewUserProfile, editUserProfile };

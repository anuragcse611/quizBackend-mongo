import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
 type: String,
 required: true,
 index: true,
 lowercase: true,
 unique: true,
 trim:true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim:true,
        
    },
  fullName: {
    type:String,
    required:true,
    trim: true,
    index:true,
  },
  password:{
    type: String,
    required: [true, 'password is required']
  },
  profilePic:{
    type:String,
   
  },
 



   
},{timestamps:true})



userSchema.pre('save', async  function(next) {
 if(!this.isModified('password')) return next()
 this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};




export const User = mongoose.model('User', userSchema)
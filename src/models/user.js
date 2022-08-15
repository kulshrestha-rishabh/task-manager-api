const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const task = require('./task')
//mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')


const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log('Invalid')
                res.status(400).send('Invalid Email');
            }
        }
    },
    age:{
        type: Number,
        validator(value){
            if(value<0){
                throw new Error("Age must be positive number")
            }

        }
    },
    password:{
        type: String,
        required:true,
        validate(value)
        {
            if(value.lenght<5)
            {
                throw new Error('Password is too small')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


UserSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})
UserSchema.methods.toJSON=function()
{
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return  userObject
}

UserSchema.methods.generateAuthToken=async function()
{
    const user=this
    //console.log(user)
    const token =jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.statics.findByCredentials= async(email,password)=>{
    const user=await User.findOne({email})
    
    if(!user)
    {
        throw new Error('Unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error('Unable to login')
    }
    return user
}
//UserSchema.index({email: 1}, {unique: true}).

//hash the plain text password before saving
UserSchema.pre('save',async function(next){
    const user=this
    //console.log('Just before saving')
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    
    next()
})
//Delete user tasks when user is deleted
UserSchema.pre('remove', async function(next){
    const user=this
    await task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('User',UserSchema)
User.createIndexes()


module.exports=User
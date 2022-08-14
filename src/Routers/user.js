const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const {sendWelcomeEmail,deleteAccountEmail}=require('../emails/account')
const router=new express.Router()

router.post('/users',async(req,res)=>{
    const user=new User(req.body)

    try{
       
        sendWelcomeEmail(user.email,user.name)
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e)
    {
        console.log(e)
        console.log('something is wrong')
        res.status(400).send(user)
    }


})
 
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        //console.log(user)
        const token =await user.generateAuthToken()
        //console.log(token)
        res.send({user,token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save()

        res.send()
    }
    catch(e)
    {
        //console.log('pta nhi')
        res.status(500).send()
    }
})
router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e)
    {
        res.status(500).send()
    }
})
router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','age','password']
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send({error:'Invalid Updates!'})
    }
    try{
        //const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        //const user=await User.findByIdAndUpdate(req.params.id, req.body)
        res.send(req.user)
    }
    catch(e)
    {
        res.status(400).send()
    }
})
router.get('/users',auth,async(req,res)=>{

    const user=await User.find({}) 
    //console.log(user)
    res.send(user)
})

router.get('/users/:id',async(req,res)=>{
    const _id=req.params.id
    //console.log(_id)
    try{
        const user=await User.findById(_id)
        if(!user)
        {
            return res.status(404).send()
        }
        res.status(201).send(user)
    }
    catch(e)
    {
        res.status(500).send()
    }
})
router.delete('/users/me',auth,async(req,res)=>{
    try{
       
        deleteAccountEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
    }
    catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})
const upload=multer({
    limits:{
        fileSize:1000000 //1MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar)
        {
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(e)
    {
        res.status(404).send()
    }
})
module.exports=router
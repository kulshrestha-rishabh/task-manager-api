const express=require('express')
require('./db/mongoose')


const userRouter=require('./Routers/user')
const taskRouter=require('./Routers/task')

const app=express()

const port=process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000 //1MB
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document'))
//         }
//         cb(undefined,true)
//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })
// const jwt=require('jsonwebtoken')

// const myFunction=async()=>{
//     const token=jwt.sign({_id:'abc123'},'kuchbhidaaldoabhi')
//     console.log(token)

//     const data=jwt.verify(token,'kuchbhidaaldoabhi')
//     console.log(data)
// }
// myFunction()

const Task=require('./models/task')
const User=require('./models/user')
//const task = require('./models/task')
// const main=async()=>{
//      const task= await Task.findById('62c4890a9257c4d5fcddf634')
//     await task.populate('owner')
//     console.log(task.owner)

// //     const user=await User.findById('62c09b9dcd80561c24a5abeb')
// //     //console.log(user)
// //      await user.populate('tasks')
// //      console.log(user.tasks)
// }
// main()
app.listen(port,()=>{
    console.log('Server is up on Port',+port)
})
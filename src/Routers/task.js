const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()


router.post('/tasks',auth,async(req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
         ...req.body,//es6 request operator
         owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e)
    {
        res.status(400).send(e)
    }

    // task.save().then(()=>{
    //         res.send(task)
    // }).catch((error)=>{
    //         res.status(400).send(error)

    // })
})
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt
router.get('/tasks',auth, async (req,res)=>{
    const match={}
    const sort={}
    if(req.query.completed)
    {
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try{
       await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
       }) 
        res.send(req.user.tasks)
   
       }
       catch(e)
       {
            res.status(400).send(e)
       }
    // Task.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
        const task= await Task.findByOne({_id,owner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const AllowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=>{
        return AllowedUpdates.includes(update)
    })
    if(!isValidOperation)
    res.status(400).send({error:'Invalid operations'})

    try{
        const task=await Task.findOne({_id:req.params.id, owner:req.user._id})

        
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body)
        if(!task)
        {
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.send(task)
    }
    catch(e)
    {
        res.status(404).send()
    }
})


router.delete('/tasks/:id',async(req,res)=>{
    try{
        const taskr=await User.findByOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
            res.status(404).send({error:'no user found'})
        }
        res.send(task)
    }
    catch(e)
    {
        res.send(500).send()
    }
})

module.exports=router
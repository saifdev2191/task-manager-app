const express = require('express');
const bcrypt = require('bcryptjs');

//import router
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//import mongoose file. Connecting to data base. Make sure mongo db server is started : To start mongodb sever 
// /Users/saifisl/mongodb/bin/mongod --dbpath=/Users/saifisl/mongo-data
require('./db/mongoose')

//import User blueprint
const User = require('./models/users')
const Task = require('./models/task')

const app = express();
const port = process.env.port || 3000;


// We need to parse incoming json payload into object. This is done by single line command provided by express
app.use(express.json())

//Instead of defing each and every route for individual model(here task and user), we can define router fn provided by express

// //Define router
// const router = new express.Router()
// //set up route
// router.get('/test',(req, res)=>{
//     res.send('testing')
// })
// //use route
// app.use(router)


//load router
app.use(userRouter)
app.use(taskRouter)



//configuring post end point in node. Here we can directly check our request from postman by sending some payload, whether our server is working
// fine or not 
// app.post('/users', async (req, res)=>{
//     // new instance of user
//     const me = new User(req.body)

//     //saving it to db
//     // me.save().then(()=>{
//     //     res.status(201).send(me)
//     // })
//     // .catch((err)=>{
//     //     res.status(400).send(err)
//     // })

//     //using await
//     try{
//         await me.save()
//         res.status(201).send(me)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }

// })

//creating get end point for reading all user
// app.get('/users', async (req, res)=>{
//     // res.send('test')
//     // Task.find({})
//     // .then((result)=>{
//     //     res.send(result)
//     // })
//     // .catch((error)=>{
//     //     res.status(500).send(error)
//     // })
//     try{
//         const users = await User.find({});
//         console.log(users)
//         res.send(users)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
    
// })

//creating get end point for reading single user
// app.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id
//     try{
//         console.log(_id)
//         const users = await User.findById({_id})
//         // console.log(users)
//         res.send(users)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })


// //creating post end point for task 
// app.post('/task',async (req, res)=>{
//     const task = new Task(req.body)
//     //save to db
//     // task.save().then(()=>{
//     //     res.status(201).send(task)
//     // })
//     // .catch((err)=>{
//     //     res.status(400).send(err)
//     // })

//     try{
//         console.log(req.body)
//         const taskCreated = await task.save()
//         res.status(201).send(taskCreated)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
    
// })


//creating get end point for reading task
// app.get('/task',async (req, res)=>{
//     // res.send('test')
//     // Task.find({})
//     // .then((result)=>{
//     //     res.send(result)
//     // })
//     // .catch((error)=>{
//     //     res.status(500).send(error)
//     // })

//     try{
//         const fetchedTasks = await Task.find({})
//         res.status(201).send(fetchedTasks)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })


//creating get end point for single reading task
// app.get('/task/:id',async (req, res)=>{
//     console.log(req.params)
//     const _id = req.params.id
//     // console.log(_id )
//     // Task.findById({_id})
//     // .then((result)=>{
//     //     if(!result){
//     //         return res.send(404).send()
//     //     }
//     //     res.send(result)
//     // })
//     // .catch((error)=>{
//     //     res.status(500).send(error)
//     // })

//     try{
//         const fetchedUser = await Task.findById({_id});
//         res.status(201).send(fetchedUser)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

//creting end point for updating user
// app.patch('/users/:id', async (req, res)=>{
//     const allowedUpdates = ['age','name','email','password'];
//     // Creating logic so that user can update only correct parameters for user like he cannot update height for any user, since it is not defined
//     // in a model
//     const updatesInput = Object.keys(req.body);
//     const isValid = updatesInput.every(el => {
//         return allowedUpdates.includes(el)
//     })
//     console.log(isValid);
//     if(!isValid){
//         return res.status(400).send('Please enter valid property of user to update')
//     }
//     const _id = req.params.id
//     try{
//     //    const updatedUser =  await User.findByIdAndUpdate(_id,{name: 'jason'});
//     //if we want to take payload directly from postman , then instead of providing static value as in above statement we can use req.body instead
//     const updatedUser =  await User.findByIdAndUpdate(_id,req.body,{new: true, runValidators: true});
//        res.status(201).send(updatedUser)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

//craeting end point for updating task
// app.patch('/task/:id', async (req, res)=>{
//     // console.log(req.params.id)
//     const allowedUpdates = ['description', 'completed'];
//     const updatesInput = Object.keys(req.body);
//     const isValid = updatesInput.every(el => {
//         return allowedUpdates.includes(el)
//     })
//     console.log(isValid);
//     if(!isValid){
//         return res.status(400).send('Please enter valid property of task to update')
//     }
//     console.log(req.body)
//     try{
//         const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})
//         res.status(201).send(updatedTask)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

//creating end point for deleting user from db
// app.delete('/users/:id',async (req, res)=>{
//     // console.log('ss',req.params.id)
//     try{
//         const deletedUser = await User.findByIdAndDelete(req.params.id);
//         res.status(200).send(deletedUser)
//     }
//     catch(e){
//         // const deletedUser = await User.findByIdAndDelete(req.params.id);
//         res.status(400).send(e)
//     }
 
// })

//creating end point for deleting task from db
// app.delete('/task/:id',async (req, res)=>{
//     // console.log('ss',req.params.id)
//     try{
//         const deletedTask = await User.findByIdAndDelete(req.params.id);
//         res.status(200).send(deletedTask)
//     }
//     catch(e){
//         // const deletedUser = await User.findByIdAndDelete(req.params.id);
//         res.status(400).send(e)
//     }
 
// })


app.listen(port,()=>{
    console.log('Server is listening on port ' + port)
})
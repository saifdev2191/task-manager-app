const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')

//create routes
const router = new express.Router();

//set routes
//creating post end point for task 
router.post('/task', auth, async (req, res)=>{
    // const task = new Task(req.body)
    //while creating task, we will provide description and completed field in a req.body but owner needs to be extracted via jwt token.So after
    //authentication we can get owner and finally we can create an object having all three fields for creating task
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})

//We need to modify this route based on whether task is completed otr not. This is required because if end user only want task that are completed
//then there is no need to give all task from db and then filter it. We can just pass the query string and filter the task at backend and return
//the filtered response
// /task?completed=true

//Pagination Defination: Pagination means limiting the search result you are showing to the end user.For ex: If one user has 100 tasks,
//u donot need to fetch 100 tasks . You can limit the number of search
//Pagination: /task?limit=10&skip=10 --> at a time we will show 10 result and skip first 10 result
//sorting: /tasks?sortBy=createdAt:asc or /tasks?sortBy=createdAt:desc

router.get('/task', auth, async (req, res)=>{
    try{
       
        // const fetchedTasks = await Task.find({
        //     owner: req.user._id,
        //     completed: req.query.completed === "true" ? true : false
        // })
        // //res.status(201).send(fetchedTasks)

        //or u can use populate method also
        // await req.user.populate('tasks')c
        //modyfying populate method to filter result
        const match = {}
        const sort = {}
        //checking if completed query is provided or not. If yes, then setting it to true or false
        if(req.query.completed){
            match.completed = req.query.completed === "true" ? true : false
        }
         //checking if sortBy query is provided or not. If yes, then splitting it where : appear to get two variables
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":");
            console.log(parts)
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }
        await req.user.populate({
            path:'tasks',
            match,
            //for pagination and sorting we can use options method. If in query strring if number is sth which is greater than search
            //result, then mongoose by default show all search result. For ex if in db we have only 4 total result and in query
            //someone set filter value to 10, then mongoose will show 4 results and won't throw an error
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                //while defining sorting : key corresponds to the parameter you want to sort and value corresponds whether sort is
                //ascending(1) or descending(-1)
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
        // res.status(201).send(fetchedTasks)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/task/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
        // const task = await Task.findById({_id});
        //We are using seconf argument owner:req.user._id, to make sure that user can only able to get task created by himself and not by other user.
        //We need this because anyone if by chance know the id of task of any other user, he can hit this end point and get the task detail of other
        //user
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if(!task){
            return res.status(404).send()
        }
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.patch('/task/:id', auth,  async (req, res)=>{
    // console.log(req.params.id)
    const allowedUpdates = ['description', 'completed'];
    const updatesInput = Object.keys(req.body);
    const isValid = updatesInput.every(el => {
        return allowedUpdates.includes(el)
    })
    if(!isValid){
        return res.status(400).send('Please enter valid property of task to update')
    }
    try{
        //commenting findByIdAndUpdate to use hash
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})
        // const getTask = await Task.findById(req.params.id)
        const getTask = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if(!getTask){
            return res.status(404).send()
        }
        updatesInput.forEach((prop)=>{
            getTask[prop] = req.body[prop]
        })
        await getTask.save()
        res.status(201).send(getTask)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/task/:id', auth, async (req, res)=>{
    try{
        // const deletedTask = await User.findByIdAndDelete(req.params.id);
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if(!deletedTask){
            return res.status(404).send()
        }
        res.status(200).send(deletedTask)
    }
    catch(e){
        // const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(400).send(e)
    }
})

//export routes
module.exports = router


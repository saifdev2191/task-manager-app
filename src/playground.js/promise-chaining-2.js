require('../db/mongoose');
const Task = require('../models/task');

// ObjectId("5e56a30fe443461862306316"),

Task.deleteOne({_id : "5e56a30fe443461862306316"}).then((user)=>{
    console.log(user)
    return Task.countDocuments({completed : false})
})
.then((r)=>{
    console.log(r)
})  
.catch((e)=>{
    console.log(e)
})
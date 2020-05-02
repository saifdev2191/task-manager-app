require('../db/mongoose');
const User = require('../models/users')

//ObjectId("5e56aa07745db22df0c0ff2d")

User.findByIdAndUpdate("5e56aa07745db22df0c0ff2d", {age: 1}).then((user)=>{
    console.log(user)
    return User.countDocuments({age: 0})
})
.then((result)=>{
    console.log(result)
})
.catch((e)=>{
    console.log(e)
})
require('../db/mongoose');
const User = require('../models/users')

//ObjectId("5e56aa07745db22df0c0ff2d")

// const updateUser = User.findByIdAndUpdate("5e56aa07745db22df0c0ff2d", {age: 1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age: 0})
// })

const aafn = async() => {
    const ret1 = await User.findByIdAndUpdate("5e56aa07745db22df0c0ff2d", {age: 1});
    const ret2 = await User.countDocuments({age: 0});
    return ret2
}

aafn().then((r)=>{
    console.log(r)
})
.catch((e)=>{
    console.log(e)
})

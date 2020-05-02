require('../db/mongoose');
const Task = require('../models/task');

// ObjectId("5e56a30fe443461862306316"),

// Task.deleteOne({_id : "5e56a30fe443461862306316"}).then((user)=>{
//     console.log(user)
//     return Task.countDocuments({completed : false})
// })
// .then((r)=>{
//     console.log(r)
// })  
// .catch((e)=>{
//     console.log(e)
// })


const deleteAndCount = async (id, completed) => {
    const delTask = await Task.deleteOne({_id: id});
    const countTask = await  Task.countDocuments({completed : completed})
    return {delTask,countTask};
    
}

deleteAndCount("5e5a24614e371d203c4c24bf", false).then((res)=>{
    console.log(res)
})
.catch((e)=>{
    console.log(e)
})
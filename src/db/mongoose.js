// load mongoose package 
const mongoose = require('mongoose')
const validator = require('validator')

//connect to database
mongoose.connect(process.env.MONGOOSEURL,{
    useNewUrlParser: true,
    //useCreateIndex : make sure we can access data quickly when mongoose works with mongoDB
    useCreateIndex: true,
})

//We need to define model/blueprint in mongoose of your data. You can tell what type of field it is, validation and other stuff
// const User = mongoose.model('User',{
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age:{
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0 ){
//                 throw new Error('provide correct age')
//             }
//         }
//     },
//     email: {
//         type: String,
//         trim: true,
//         lowerCase: true,
//         required: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim: true,
//         minlength: 7,
//         validate(value){
//             console.log(value)
//             if(value ===  "password"){
//                 console.log(value)
//                 throw  new Error('Password value cannot be equal to password')
//             }
//         }
//     }
// })

// const Task = mongoose.model('Task', {
//     description:{
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     }
// })

//create instance of above model
// const me = new User({
//     name: "  pika",
//     email: "abc@gmail.com   ",
//     password: " ss"
    
// })

// const task = new Task({
//     description: "Mongoose class",
//     completed: false
// })

//CRUD operations to save your instance. Here we are saving our instance to databbse
// me.save().then((me)=>{
//     console.log(me)
// })
// .catch((error)=>{
//     console.log(error)
// })



// task.save().then((res)=>{
//     console.log(res)
// })
// .catch((err)=>{
//     console.log(err)
// })



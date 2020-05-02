const express = require('express');


//import router
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//import middleware
const auth = require('./middleware/auth')

//import mongoose file. Connecting to data base. Make sure mongo db server is started : To start mongodb sever 
// /Users/saifisl/mongodb/bin/mongod --dbpath=/Users/saifisl/mongo-data
require('./db/mongoose')

//import User blueprint
const User = require('./models/users')
const Task = require('./models/task')


const app = express();
console.log('env variables', process.env.PORT)
const port = process.env.PORT;

// We need to parse incoming json payload into object. This is done by single line command provided by express
app.use(express.json())

//load router
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server is listening on port ' + port)
})


const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
   // We want to get owner of a task. This field will be used to get owner of  a particular task. So doing sth like task.owner will give us owner info.
    owner:{
        //setting up relationship between task and user by specifying user object id as a one property on task schema
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //ref is used to define relationship between two models. Here we are trying to link owner property of Task model to User model.
        //If ref is not used then by default owner property will be just get popluated with object id of logged in user. However if we 
        //want to populate the owner property not with the object id but with the whole logged in user data, then we can do so because 
        //we have created ref.
        // To do so we can use : await task.populate('owner').execPopulate() [model.populate(field u want to populate).execPopulate()]
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task
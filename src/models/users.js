// load mongoose package 
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')
//We need to define model/blueprint in mongoose of your data. You can tell what type of field it is, validation and other stuff

//creating user schema to make use of middleware. If middle ware is not required we ccan directly make use of mongoose.model()
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0 ){
                throw new Error('provide correct age')
            }
        }
    },
    email: {

        //unique set to true so that no two user can have same email address
        unique: true,
        type: String,
        trim: true,
        lowerCase: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 7,
        validate(value){
            // console.log(value)
            if(value ===  "password"){
                // console.log(value)
                throw  new Error('Password value cannot be equal to password')
            }
        }
    }
    ,
    //Adding token as a part of userSchema. Because we want to save token in db for each user. But why? Because after authentiction, we want to 
    //search for the user from the db using the token provided by it.
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    //Field for storing profile picture of user. We donot need any validation since multer is already taking care of it
    avatar: {
        type: Buffer
    }

},{
    //This is second argument field. We are setting timestamps to true by default it is set to false.
    timestamps: true
})


//We want to get all task corresponding to a particular user.  i.e by doing sth like user.task we should get all task corresponding to that user. 
//But for that we need to  modify user schema like we did in task schema and can specify task array corresponding to the user.But we have sth called
//as virtual property we can define on our model user. This will be virtal property and data defined on that property won't be saved in db. It will
//only for the reference of mongoose: userSchema.virtual(name of virtual field,{we specify relationship between fields of two different model})
//Note: Virtual field defimed below 'tasks', won't be saved in db
userSchema.virtual('tasks', {
    ref: 'Task',
    localField:'_id',
    foreignField:'owner'
})


// using statics method on userschema to create our own fn . This function is used to compare credentails and authenticate the user. Static
// method are applicable to the userSchema as a whole and not on instance of userSchema. In short static method are used on model directly
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email:email})
    // console.log('user', user)
    if(!user){
        throw new Error('Unable to login')
    }

    // console.log('password', password)
    // console.log('user.password', user.password)
    //comparing password. Hash algo is irreversuble. Here first argument is plain text and second argumnet is hashed value of that plain text.
    //bcrypt.compare() function just convert plain password -> hash value and then again compare both the hash value to detemine the truthy or
    // falsy value
    //bcrypt.compare(plain text password given by user upon login , hashed value of password retreived from db)
    
    // const isMatch = await bcrypt.compare(password, user.password)
    // if(!isMatch){
    //     throw new Error('Unable to login')
    // }
    // console.log('successfull login')
    return user
}

//creating a function to create json web token for each instance of user. Each user might be logged in from multiple machines at once and
// therefore each machine should have unique jwt token.
//Thats the reason creation of jwt is attached to method(i.e. each instance of user) and login method is attached to static (i.e. on each user)
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    //Generate jwt token. Note here we are using toString() method on id to convert object id into string id
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWTSECRETKEY);
    //Adding genertaed token to userSchema
    user.tokens = user.tokens.concat({token});
    //Saving token to db 
    await user.save()
    return token;
}

//Attaching  a function getPublicProfile on each instance of user. We will only send non sensetive data back as a response
// userSchema.methods.getPublicProfile = function(){
//     const user = this;
//     // console.log(user)
//     // console.log(user.toObject())
//     const userObject = user.toObject();
//     delete userObject.password;
//     delete userObject.tokens;
//     return userObject
// };

//There is alternate and better way to send the response we want to send by using .toJSON method on each instance of user. This method allow
//us to return the object we want to return without even calling that method.
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    //we also donot need to send avatar , since it will be overhead for user info. We are already taking care of sending avatar back in
    //another request
    delete userObject.avatar;
    return userObject
}

//Using middle ware for password. Here we are using pre method on our schema which means we want to run our middleware before save event.
//We have also post method available, to do something after user has saved it
//Here we donot use arrow fn in callback bcoz we need this binding. Here this represent the document which is getting saved. In this it is user that is about to be save.
// Some advance method like findByIdAndUpdate bypass middleware. So if we are using these queries we need to remove them and use more traditional way of updating user. For ex first retrieve the user using 
//findById and then update it
userSchema.pre('save',async function(next){
    const user =this;
    // console.log('user 78', user)
    //first verify that password is plain text. user.isModified() will return true if user is being created for first time(since then password will be plain text) or password is getting updated as a part of updated method.
    //i.e  password argument should be plain text for this fn to return true
    if(user.isModified('password')){
        console.log('password will be hashed')
        // console.log(user.password)
        //Hashing the password
        user.password= await bcrypt.hash(user.password,8)
    }
    //next is used when we are done using save. If we donot use next then our prog will hang for ever since it will never know when we are done
    next();
})


//Using middleware for deleting all task for a given user if he remove himself
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})
    next();

})

// console.log(userSchema)

const User = mongoose.model('User',userSchema)

module.exports = User
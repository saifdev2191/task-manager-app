const express = require('express');
const User = require('../models/users');
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmails, sendCancelEmails} = require('../emails/accounts')

//importing middleware fn
const auth = require('../middleware/auth')

//create router
const router = new express.Router();
//set up routes
// router.get('/test',(req, res)=>{
//     res.send('testing:::')
// })


//set up routes and not adding middleware
router.post('/users', async (req, res)=>{
    // new instance of user
    const me = new User(req.body);
    try{
        //sending welcome email to user
        //Note: This function return promise but we are not waiting for that promise to get fulfilled.Because it is not core 
        //functionality bit addedon feature
        sendWelcomeEmails(me.email, me.name);
        //generate a token when user is signed up
        const token = await me.generateAuthToken()
        // await me.save()
        res.status(201).send({me, token})
    }
    catch(e){
        res.status(400).send(e)
    }

})

//creating login for user and not adding middleware
router.post('/users/login',async (req, res)=>{
    try{
        //creating our own fn findByCredentials to validate the user.We are defining that fn in user schema directly i.e on 'User' and not on 
        //individual user i.e. 'user'
        const user = await User.findByCredentials(req.body.email, req.body.password);
        
        //Creating jwt token for each user who is getting logged in . Note that here, the jwt token is defined on individual user i.e. 'user' and 
        //not on schema i.e. 'User' because jwt token is unique for each instance of user. 
        //Note: We need jwt token for each instance of user when we are signing in or creating user for the first time
        const token = await user.generateAuthToken();

        //Returning user public profile and not whole user object since whole user object has sensetive information like password and all list of 
        // jwt tokens corresponding to that user  and we dnont want to send those in a response.
        // res.send({user: user.getPublicProfile(), token})

        //or we can make use of .toJSON method and donot change the response from here but change in userSchema.methods.toJSON
        res.send({user, token})
    }
    catch(e){
        res.status(400).send()
    }
})

//Logout route 
router.post('/users/logout', auth, async(req, res) => {
    try{
        // console.log('token:', req.token)
        // console.log('user', req.user)
        //req.token => machine/user who is trying to get logged out

        //You need to delete the jwt token from the user schema who is trying to get logged out
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el.token !== req.token
        })
        debugger;

        //save the updated user in db
        await req.user.save()

        //send the response
        res.status(200).send()
    }
    catch(e){
        res.status(500).send()
    }
})

//logout from all instance
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
    //delete all jwt token
    req.user.tokens = [];
    //update the db 
    await req.user.save()
    //send the response
    res.status(200).send()

    }
    catch(e){
        res.status(500).send()
    }
})


//request to get all users. We are using auth as second argument for middleware. Now this end point first run the middlware and then run the
//route handler if condition say so. 
//Note: While using middleware in the routes, just pass the middleware fn as the second argument. You don't need to explicitly call the middleware
// function.
//Now: user get req --> middleware --> route handler


//This end point expose all users. Not very practical case. So we will comment out this end point and create new one
router.get('/users', auth, async (req, res)=>{
    console.log(req.user)
    try{
        const users = await User.find({});
        console.log(users)
        res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})



//This route will be pinged after authentication(because of middleware) and response will be the logged in user info
router.get('/users/me', auth, async (req, res)=>{
    console.log(req.user)
    // console.log(req.user.toObject())
    res.send(req.user)
})


//This route should not be there, since any other person can see the info about other user. Each user should only be able to see data corresponding
//to himself
// router.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id

//     try{
//         // console.log(_id)
//         const users = await User.findById({_id})
//         // console.log(users)
//         res.send(users)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

router.patch('/users/me', auth,async (req, res)=>{
    const allowedUpdates = ['age','name','email','password'];
    // Creating logic so that user can update only correct parameters for user like he cannot update height for any user, since it is not defined
    // in a model
    const updatesInput = Object.keys(req.body);
    const isValid = updatesInput.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValid){
        return res.status(400).send('Please enter valid property of user to update')
    }
    // const _id = req.user._id
    try{
    //    const updatedUser =  await User.findByIdAndUpdate(_id,{name: 'jason'});
    //if we want to take payload directly from postman , then instead of providing static value as in above statement we can use req.body instead
    //commenting findByIdAndUpdate to use middleware since findByIdAndUpdate bypasses mongoose and update db directly.

    // const updatedUser =  await User.findByIdAndUpdate(_id,req.body,{new: true, runValidators: true});
        // const user = await User.findById(_id);
        updatesInput.forEach((proper)=>{
            req.user[proper] = req.body[proper]
        })
        // console.log(user)
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//user should only be able to delete its own profile. Therefore adjusting the route and adding middleware
router.delete('/users/me',auth, async (req, res)=>{
    try{
        // const deletedUser = await User.deleteOne({_id: req.user._id});
        // console.log(req.user._id)
        //or u can also use to remove from db
        await req.user.remove();
        // we also need to delete the task corresponding to user if he decide to remove himself. One way is to write some over here or second
        //approach will be to use middleware. We will take middleware approach.
        
        //sending email to client when he deletes his account
        sendCancelEmails(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
 
})

//setting up end point for user to upload the profile pic
const upload = multer({
    //dest filed is required if u want to save picture in your file system. But we donot want this becuase at the end of the day,
    //we need to push our code to some server and if we store our picture in our local file system it will be lost. So we need 
    //to first access the picture in our code from multer and then save to database. To access picture you just need to remove dest
    //field from your cconfiguration and then u can receive the picture as a req.file.Therfore now we are using multer for 
    //validation and then using the req.file to get the profile picture back

    // dest: 'avatars',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('please upload either jpg, jpeg or png'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)  => {
    //Using sharp npm module to formatting the image before saving it to db so that every avatar pic is consistent(same dimension, same format)
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer();
    
    //removing dest field in above configuration, so that we can access profile pic as buffer
    // req.user.avatar = req.file.buffer
    //Instead of sending original image buffer req.file.buffer , we are sending modified image buffer from sharp i.e. buffer
    req.user.avatar= buffer

    //save to the db
    await req.user.save()
    res.send()
},
//We are adding this code to give back error response. This piece of code will also catch the error from fileFilter and send them as
//proper json and not as html
(error, req, res, next) => {
    //For handling errors
    res.status(400).send({
        error: error.message
    })
})

//delete avatar
router.delete('/users/me/avatar', auth, async(req,res) => {
    if(req.user.avatar){
        req.user.avatar = undefined
    }
    await req.user.save()
    res.status(200).send()
})

//get avatar
router.get('/users/:id/avatar', async(req, res) => {
    // const bufferImg = req.user.avatar;
    // console.log(bufferImg)
    // res.status(200).send()
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        //set type of content received by user in header response
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

// router.post('/users/me/avatar', upload.single('avatar'), async (req,res)  => {
//     try{
//         res.send()
//     }
//     catch(e){
//         res.status(400).send({
//             error: error.message
//         })
//     }
    
// })

// router.delete('/users/:id', async (req, res)=>{
//     try{
//         const deletedUser = await User.findByIdAndDelete(req.params.id);
//         res.status(200).send(deletedUser)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
 
// })


//export routes
module.exports = router
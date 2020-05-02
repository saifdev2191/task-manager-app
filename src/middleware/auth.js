const jwt = require('jsonwebtoken');
const User = require('../models/users')
//without middleware: new request --> run router handler
//with middleware: new request --> do  sth --> run route handler

//Here we have access to third argument known as next. 
//To make sure route handler run after middleware completes its work, we need to declare next() in next line. There might be a sitaution
// where u donot want route handler to run based on some condition provided by middleware. In that scenario we won't declare next()
// Example: If your site is under maintenece u can use middleware to show the meassage and never run any route handler by not declaring
//next()

// app.use((req, res, next)=>{
//     console.log(req.method, req.path);
//     next()
// })


//Registring middleware for authentication for all routes except sign up and login. So we can add middleware explicitly in the routes end point
// where we actually want  to consume the middleware and therefore we can't use sth like :
// app.use((req, res, next)=>{
//     console.log(req.method, req.path);
//     next()
// })
//above. Because if we use middleware like above, then we are actually using middleware for all routes and not for specific routes.
const auth = async (req, res, next) => {
    try{    
        //extracting the token provided by the client in the header.
        const token = req.header('Authorization').replace('Bearer ','');

        //authenticate the token provided by the client using secret key (which is only known to the server).
        const decoded = jwt.verify(token, process.env.JWTSECRETKEY);

        // return value of decoded is { _id: '5ea40e3eef2b7033555e95d7', iat: 1587810375 } which contain user id which was initially provided while
        //creating the jwt token
        // console.log(decoded)
        //If authentication is successfull, then we need to find the exact user from db using the provided token. Also apart from providing the id
        // to find the user , we also need to make sure that the particular user still have the token present. Because when we log-off we need 
        // to delete the token. So we need to make sure that user is still logged in and he has the token present in it schema.
        //If we donot check this condition, then user may be logged off but he will directly hit the get route with the token present in the header
        //and he will be able to login
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error;
        }

        //Single user might be logged in using three machines. Each machine has its own jwt token generated at the time of logging in for a single
        //user. Note: jwt token is created using user_id and secret key which is same for all three users, but jwt token will be different for all
        //three users. So every machine will get unique jwt token, which is identifier for that machine but after decoding of all three jwt 
        // token they will point out to single logged in user.
        //So while we try to log out from one machine we donot want to get logged out from other two machines. Therefore we will delete the jwt
        //token for that machine only.Here we are setting a key on req so that we can track jwt token for each machine. 
        //To sum up, each user might be having multiple corresponding jwt token for each machine from where it is logged in.
        // jwt is a property for a machine which is assigned to it by a server so it can remember that machine
        req.token = token;

        //Now since we have find out the actual user who has logged in, we can pass this user info the route handlers by setting the user as
        // a key in req object
        req.user = user;

        //run the route handlers now
        next()
    }
    catch(e){
        res.status(501).send('Please Authenticate')
    }

}

module.exports = auth;
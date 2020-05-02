//CRUD operation
// const mongodb = require('mongodb');  //It will return an mongodb obj

//To intialize connection
// const MongoClient = mongodb.MongoClient;

//To get objectID
// const ObjectID = MongoClient.ObjectID;

//usinfg destructuring
//We can create also create ObjectIds. In usual scenario, it is mongodb which create globally inique ids for every field when it get inserted.
//However we can also create object ids even before field is inserted using mongodb library
const {MongoClient,ObjectID } = require('mongodb');
// const id = new ObjectID();


//connection url
const connectionURL = 'mongodb://127.0.0.1:27017'

//databse name(our choice)
const databaseName = 'task-manager'

//Connect to mongodb server. Second argument needs to be set to be true for our url to be passed correctly. Third arg is callback fn which will 
//run when connection is established
MongoClient.connect(connectionURL, { useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log('Unable to connect to database')
    }
    console.log('Connected correctly !')

    //create database reference db 
    const db = client.db(databaseName);
 
    //Create database using insertOne and insertMany

    //Inserting users collection in db Insertone is asyn
    // db.collection('users').insertOne({
    //     name: 'nazish_updated',
    //     age: 28
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // }
    // )

    //Insert Many
    // db.collection('users').insertMany([
    //     {
    //     name:'andrew',
    //     age: 28
    //     },
    //     {
    //     name:'sarah',
    //     age: 26
    //     }
    // ],
    // (error, result)=>{
    //     if(error){
    //         return console.log('Unable to insert document')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('family').insertMany([
    //     {
    //         name: 'appi',
    //         age: 32,
    //         occ: 'Legal adviser'
    //     },
    //     {
    //         name: 'amal',
    //         age: 30,
    //         occ: 'doctor'

    //     },
    //     {
    //         name: 'sarah',
    //         age: 26,
    //         occ:'student'

    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert doc')
    //     }
    //     console.log(result.ops)
    // })



    //Reading from database using findOne and find


    //read single field
    // db.collection('users').findOne({_id: new ObjectID("5e526054e2ad67354e5add79")}, (err, result)=> {
    //     if(err){
    //         return console.log('Unabble to fetch')
    //     }
    //     console.log(result)
    // })

    //read many fields. find fn doesnot accept callback as an argument
    // console.log(db.collection('users').find({name: 'andrew'}).toArray((err, result)=>{
    //     console.log(result)
    // }))

    //Above method doesnot return the value you was expecting but return a pointer to the value in database

    // console.log(db.collection('users').find({name: 'andrew'}).count((err, result)=>{
    //     console.log(result)
    // }))


    //Update
    //updateMany and update are used for updating: These method return promise if no callback is used

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e526054e2ad67354e5add79")
    // },
    // {
    //     $set: {
    //         name:'pikachu'
    //     }
    // })
    // .then((result)=>{
    //     console.log(result)
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })

    // db.collection('users').updateMany({
    //     name: 'sarah'
    // },
    // {
    //     $set:{
    //         name: 'sarru'
    //     }
    // })
    // .then((res)=>{
    //     console.log(res)
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })

    //delete
    db.collection('users').deleteMany({
        age: 28
    })
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
})  
   

